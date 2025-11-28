export async function getGeminiCategory(description) {
  try {
    console.log("🧠 Sending to Gemini:", description);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        import.meta.env.VITE_GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a civic complaint classifier.
Categories: ROAD, GARBAGE, WATER, ELECTRICITY, OTHER.
Respond with exactly one of these words.

Complaint: ${description}
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("🤖 Gemini raw output:", data);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      ?.toUpperCase();

    const valid = ["ROAD", "GARBAGE", "WATER", "ELECTRICITY", "OTHER"];
    if (valid.includes(text)) return text;

    // fallback logic if Gemini returns weird text
    const desc = description.toLowerCase();
    if (desc.includes("garbage") || desc.includes("trash") || desc.includes("waste"))
      return "GARBAGE";
    if (desc.includes("road") || desc.includes("street") || desc.includes("pothole"))
      return "ROAD";
    if (desc.includes("water") || desc.includes("pipe") || desc.includes("drain"))
      return "WATER";
    if (desc.includes("light") || desc.includes("electric") || desc.includes("power"))
      return "ELECTRICITY";
    return "OTHER";
  } catch (err) {
    console.error("❌ Gemini classification error:", err);
    return "OTHER";
  }
}
