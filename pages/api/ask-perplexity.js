// pages/api/ask-perplexity.js
import { askPerplexity } from '../../lib/perplexityClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await askPerplexity(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Perplexity API Error:', error);
    res.status(500).json({ error: 'Failed to get response from Perplexity' });
  }
}
