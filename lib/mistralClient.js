export async function askMistral(content) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistral-small', // puoi anche usare 'mistral-tiny' o 'mistral-medium'
      messages: [{ role: 'user', content }]
    })
  });

  const result = await response.json();
  return result.choices?.[0]?.message?.content || '[No response]';
}
