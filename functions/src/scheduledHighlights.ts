// Cloud Function: scheduledHighlights
// Trigger: Runs daily at 7:00 AM IST (1:30 AM UTC)
// Generates daily highlights using top articles + Gemini AI

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

export const scheduledHighlights = functions
  .region('asia-south1')
  .pubsub.schedule('30 1 * * *')  // 1:30 AM UTC = 7:00 AM IST
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    try {
      // 1. Get top 5 most-viewed published articles from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const articlesSnap = await db.collection('articles')
        .where('status', '==', 'published')
        .where('publishedAt', '>=', admin.firestore.Timestamp.fromDate(yesterday))
        .orderBy('publishedAt', 'desc')
        .orderBy('views', 'desc')
        .limit(5)
        .get();

      if (articlesSnap.empty) {
        functions.logger.info('No articles found for daily highlights');
        return null;
      }

      const articles = articlesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const articleTitles = articles.map((a: any) => a.title_te).join('\n');
      const articleIds = articles.map((a: any) => a.id);

      // 2. Generate summary using Gemini API
      let bulletPoints: string[] = [];
      let summaryText = '';

      try {
        const geminiApiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;
        if (geminiApiKey) {
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(geminiApiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

          const prompt = `You are a Telugu news anchor. Summarize today's top news stories into:
1. A one-paragraph Telugu summary (summaryText)
2. Exactly 5 bullet points in Telugu, each under 20 words

Article titles:
${articleTitles}

Return in JSON format: { "summary": "...", "bullets": ["...", "...", "...", "...", "..."] }
Return only valid JSON.`;

          const result = await model.generateContent(prompt);
          const response = result.response.text();

          // Parse JSON from response
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            summaryText = parsed.summary || '';
            bulletPoints = parsed.bullets || [];
          }
        } else {
          // Fallback: use article titles as bullets
          bulletPoints = articles.map((a: any) => `• ${a.title_te}`).slice(0, 5);
          summaryText = `ఈరోజు ముఖ్య వార్తలు: ${articleTitles.substring(0, 200)}`;
        }
      } catch (aiError) {
        functions.logger.error('AI summary generation failed:', aiError);
        bulletPoints = articles.map((a: any) => `• ${a.title_te}`).slice(0, 5);
        summaryText = `ఈరోజు ముఖ్య వార్తలు`;
      }

      // 3. Save highlight document
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      await db.collection('highlights').doc(today).set({
        id: today,
        date: today,
        summaryText_te: summaryText,
        summaryText_en: '', // can be filled later
        bulletPoints_te: bulletPoints,
        articleIds,
        isAIGenerated: true,
        audioUrl: '', // TTS can be generated later
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 4. Send FCM notification
      await messaging.sendToTopic('all', {
        notification: {
          title: `📰 ఈరోజు వార్తలు`,
          body: `ఈరోజు వార్తలు అందుబాటులో ఉన్నాయి`,
        },
        data: {
          type: 'highlights',
          date: today,
        },
      });

      functions.logger.info(`Daily highlights generated for ${today}`);
    } catch (error) {
      functions.logger.error('scheduledHighlights error:', error);
    }

    return null;
  });
