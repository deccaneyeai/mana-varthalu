// Cloud Function: onArticleApproved
// Trigger: Firestore onUpdate /articles/{articleId}
// When status changes to "published", sends FCM notifications

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

export const onArticleApproved = functions
  .region('asia-south1')
  .firestore.document('articles/{articleId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const articleId = context.params.articleId;

    // Only trigger when status changes to 'published'
    if (before.status === 'published' || after.status !== 'published') {
      return null;
    }

    const titleTe = after.title_te || '';
    const bodyTeFirstLine = (after.body_te || '').split('\n')[0].substring(0, 100);
    const category = after.category || '';
    const district = after.district || '';
    const isBreaking = after.isBreaking || false;

    // Notification payload
    const notification: admin.messaging.NotificationMessagePayload = {
      title: isBreaking ? `⚡ బ్రేకింగ్: ${titleTe}` : titleTe,
      body: bodyTeFirstLine,
    };

    const data: Record<string, string> = {
      articleId: articleId,
      type: isBreaking ? 'breaking' : 'article',
      category,
    };

    try {
      // 1. If breaking news → send to "all" topic
      if (isBreaking) {
        await messaging.sendToTopic('all', { notification, data });
        functions.logger.info(`Breaking news FCM sent to topic 'all': ${titleTe}`);
      }

      // 2. If district tagged → send to district topic
      if (district) {
        const topicName = `district_${district.replace(/\s+/g, '_').toLowerCase()}`;
        await messaging.sendToTopic(topicName, { notification, data });
        functions.logger.info(`District FCM sent to topic '${topicName}': ${titleTe}`);
      }

      // 3. Send to category topic
      if (category) {
        const categoryTopic = `category_${category}`;
        await messaging.sendToTopic(categoryTopic, { notification, data });
        functions.logger.info(`Category FCM sent to topic '${categoryTopic}': ${titleTe}`);
      }

      // 4. Create notification document
      await db.collection('notifications').add({
        title_te: notification.title,
        body_te: bodyTeFirstLine,
        articleId,
        type: isBreaking ? 'breaking' : (district ? 'local' : 'category'),
        targetAudience: isBreaking ? 'all' : (district ? 'district' : 'category'),
        targetValue: isBreaking ? '' : (district || category),
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        scheduledAt: null,
        status: 'sent',
      });

      // 5. Update article publishedAt if not set
      if (!after.publishedAt) {
        await change.after.ref.update({
          publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      functions.logger.info(`Article approved and notifications sent: ${articleId}`);
    } catch (error) {
      functions.logger.error(`Error in onArticleApproved: ${error}`);
    }

    return null;
  });
