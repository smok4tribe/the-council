// pages/api/ask-mistral.js
import { askMistral } from '../../lib/mistralClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await askMistral(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Mistral API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Mistral' });
  }
}