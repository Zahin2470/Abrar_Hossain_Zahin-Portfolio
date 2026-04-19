import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert AI research advisor for Abrar Hossain Zahin's portfolio. Your speciality is generating novel, publishable research directions in AI, ML, Computer Science, and related fields.

When given a research topic, generate exactly 5 novel and specific research ideas. Each idea must be original, feasible for a graduate student or early researcher, and grounded in current trends.

Respond ONLY with a valid JSON object in this exact format (no markdown, no backticks, no extra text):

{
  "topic": "The research topic provided",
  "overview": "2-3 sentences about the current state of this research area and why it is exciting right now",
  "ideas": [
    {
      "id": 1,
      "title": "Specific, catchy research title (10-15 words)",
      "tagline": "One punchy sentence explaining the core idea (max 20 words)",
      "problem": "What gap or challenge does this address? (2-3 sentences)",
      "methodology": "How would you approach this research? Specific techniques, datasets, or frameworks (3-4 sentences)",
      "novelty": "What makes this new compared to existing work? (1-2 sentences)",
      "expectedOutcome": "What result or contribution would this produce? (1-2 sentences)",
      "difficulty": "MSc | PhD | Industry",
      "timeEstimate": "e.g. 6-12 months",
      "domains": ["domain1", "domain2"],
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
    }
  ],
  "hotTopics": ["3-5 trending sub-topics in this area worth watching"],
  "suggestedDatasets": ["2-4 relevant datasets or benchmarks for this area"],
  "tip": "One piece of practical advice for someone starting research in this area"
}

Rules:
- Make ideas genuinely novel — not just "apply transformer to X"
- Be specific about methodology (name actual algorithms, frameworks, datasets)
- Vary difficulty across the 5 ideas (some accessible, some ambitious)
- Keep language clear but technically accurate
- Focus on publishable contributions, not just experiments`;

export async function POST(request) {
  try {
    const apiKey = process.env.Zahin_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Zahin_API_KEY not configured. Add it to your Vercel environment variables." },
        { status: 500 }
      );
    }

    const { topic, context } = await request.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "No topic provided." }, { status: 400 });
    }

    const userMessage = context?.trim()
      ? `Research topic: ${topic.trim()}\n\nAdditional context: ${context.trim()}`
      : `Research topic: ${topic.trim()}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2500,
        temperature: 0.75, // slightly higher for creativity
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Zahin API error:", err);
      return NextResponse.json({ error: "AI service error. Please try again." }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({ result: parsed });
    } catch {
      return NextResponse.json({ result: null, raw });
    }
  } catch (err) {
    console.error("Research ideas route error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
