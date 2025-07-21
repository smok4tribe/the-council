// pages/api/orchestrator.js
import { orchestrateConversation } from '../../lib/orchestrator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, mute, maxRounds } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }

  try {
    const result = await orchestrateConversation(question, maxRounds || 1, mute || false);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Orchestrator API error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
