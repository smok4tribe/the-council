import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

export async function askGemini(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
