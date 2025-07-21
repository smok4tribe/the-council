export async function askPerplexity(content) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3-sonar-large-32k-online', // modello corretto
      messages: [{ role: 'user', content }]
    })
  });

  const result = await response.json();
  return result.choices?.[0]?.message?.content || '[No response]';
}
