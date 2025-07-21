import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askGPT(prompt) {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are GPT, a wise AI in the council.' },
      { role: 'user', content: prompt }
    ]
  });
  return res.choices[0].message.content.trim();
}
