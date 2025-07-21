export function detectQuoteTargets(message) {
  const names = ['GPT', 'Claude', 'Gemini', 'Groq', 'Mistral', 'Perplexity', 'HuggingFace'];
  const lower = message.toLowerCase();
  return names.filter(name => lower.includes(name.toLowerCase()));
}

export function detectQuestion(message) {
  return message.includes('?');
}

export function detectConsensus(message) {
  const consensusKeywords = [
    'sono d’accordo',
    'concordo',
    'nulla da aggiungere',
    'condivido',
    'allineato',
    'mi trovo d’accordo',
    'anche per me va bene'
  ];
  const lower = message.toLowerCase();
  return consensusKeywords.some(phrase => lower.includes(phrase));
}
