import OpenAI from 'openai';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function askGroq(prompt) {
  const res = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: 'You are Groq, an AI participating in a council.' },
      { role: 'user', content: prompt }
    ]
  });
  return res.choices[0].message.content.trim();
}
