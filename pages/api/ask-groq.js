// pages/api/ask-groq.js
import { askGroq } from '../../lib/groqClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await askGroq(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Groq' });
  }
}