// pages/api/ask-gpt.js
import { askOpenAI } from '../../lib/openaiClient';

export default async function handler(req, res) {
  const { prompt } = req.body;
  try {
    const response = await askOpenAI(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('GPT error:', error);
    res.status(500).json({ error: 'GPT request failed' });
  }
}
