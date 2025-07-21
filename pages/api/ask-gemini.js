// pages/api/ask-gemini.js
import { askGemini } from '../../lib/geminiClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await askGemini(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
}
