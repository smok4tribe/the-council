export async function askHuggingFace(question) {
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Assicurati del nome esatto della variabile
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
      model: "mistralai/Mistral-7B-Instruct-v0.3:novita", // oppure "mistralai/mistral-7b-instruct"
    }),
  });

  const result = await response.json();

  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error("❌ Hugging Face ha risposto ma senza messaggio.");

  console.log("📤 HuggingFace final message:", content);
  return content;
}
