// Gemini AI service for Admin Panel
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function rewriteInTelugu(body: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `You are a senior Telugu journalist. Rewrite the following article in beautiful, literary Telugu suitable for a newspaper. Maintain all facts. Use proper Telugu grammar and vocabulary. Article: ${body}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateBulletSummary(body: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Summarize the following Telugu news article into exactly 5 concise bullet points in Telugu. Each bullet must be under 15 words. Start each with \u2022. Article: ${body}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.split('\n').filter(line => line.trim().startsWith('\u2022')).map(line => line.trim());
}

export async function translateToTelugu(bodyEn: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Translate the following English news article to natural, fluent Telugu. Maintain journalistic tone. Do not transliterate \u2014 use pure Telugu script. Article: ${bodyEn}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function suggestTags(body: string): Promise<{ tags: string[]; category: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `Analyze this Telugu news article and return a JSON object with:\n- tags: array of 5 relevant Telugu keyword tags\n- category: one of [politics, sports, entertainment, business, crime, international, technology, health, education, local, devotional]\nArticle: ${body}\nReturn only valid JSON, no explanation.`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\\s\\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return { tags: [], category: 'local' };
}

export async function generateImagePrompt(title: string): Promise<string> {
  return `Create a realistic news photograph for a Telugu news article about: ${title}. Style: professional photojournalism, no text overlays, suitable for a newspaper front page.`;
}
