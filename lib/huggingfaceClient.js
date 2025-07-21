export async function askHuggingFace(question) {
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
      model: "mistralai/Mistral-7B-Instruct-v0.3:novita",
    }),
  });

  const result = await response.json();

  const content = result?.choices?.[0]?.message?.content;

  if (!content || content.trim() === "") {
    console.warn("❌ Nessun contenuto nella risposta di Hugging Face:", result);
    return "[No response]";
  }

  console.log("🧠 HuggingFace final message:", content);
  return content.trim();
}
