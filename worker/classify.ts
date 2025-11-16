import { groq } from "./lib/groq";
import Message from "./models/Message";

export default async function classifyMessage(messageId: string) {
  const msg = await Message.findById(messageId);
  if (!msg) throw new Error("Message not found");

  const prompt = `
Classify the following customer message.

Return ONLY pure JSON in this exact format:

{
  "tags": [],
  "priority": "",
  "summary": ""
}

Message:
"${msg.body}"
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("No content in completion response");
    }
    
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        tags: ["other"],
        priority: "MEDIUM",
        summary: msg.body.slice(0, 40),
      };
    }

    // Normalize and validate tags
    const tags = Array.isArray(parsed.tags) 
      ? parsed.tags.map((t: string) => String(t).toLowerCase()).filter(Boolean)
      : ["other"];
    
    // Normalize and validate priority
    const priority = typeof parsed.priority === "string" 
      ? parsed.priority.toUpperCase()
      : "MEDIUM";
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const normalizedPriority = validPriorities.includes(priority) ? priority : "MEDIUM";

    msg.tags = tags;
    msg.priority = normalizedPriority;
    msg.history.push({
      type: "tagged",
      payload: parsed,
      timestamp: new Date(),
    });

    await msg.save();
  } catch (err) {
    console.error("Groq error:", err);

    const errorMessage = err instanceof Error ? err.message : String(err);
    msg.tags = ["other"];
    msg.priority = "MEDIUM";
    msg.history.push({
      type: "tagged-error",
      payload: { error: errorMessage },
      timestamp: new Date(),
    });

    await msg.save();
  }
}
