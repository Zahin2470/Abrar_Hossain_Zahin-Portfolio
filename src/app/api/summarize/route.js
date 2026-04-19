import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert AI research assistant created for Abrar Hossain Zahin's portfolio. Your job is to summarize academic research papers in clear, plain English so that anyone — including non-experts — can understand them.

When given a research paper title, abstract, or link, you must respond with a structured JSON object (and ONLY that JSON — no markdown, no backticks, no preamble) in this exact format:

{
  "title": "Paper title (extract from input or write 'Research Paper')",
  "oneLiner": "One sentence that captures the entire paper in plain English (max 25 words)",
  "problem": "What problem does this paper solve? (2-3 sentences, simple language)",
  "method": "How did the researchers solve it? What technique/approach did they use? (2-4 sentences)",
  "findings": "What did they find or achieve? Key results and numbers if any (2-3 sentences)",
  "whyItMatters": "Why does this research matter? Real-world impact (1-2 sentences)",
  "difficulty": "Beginner | Intermediate | Advanced",
  "domains": ["array", "of", "research", "domains"],
  "keyTerms": [
    { "term": "Technical term", "meaning": "Plain English explanation (max 10 words)" }
  ],
  "tldr": "TL;DR in one casual sentence (like explaining to a friend)"
}

Rules:
- Use simple, clear language. Avoid jargon unless you explain it in keyTerms.
- keyTerms: include 3-5 most important technical terms from the paper.
- domains: 2-4 domains like "Medical AI", "Computer Vision", "NLP", "Cryptography", etc.
- If given a URL you cannot access, say in the oneLiner: "URL not accessible — paste the abstract directly."
- Always return valid JSON. Never add commentary outside the JSON.`;

export async function POST(request) {
  try {
    const apiKey = process.env.Zahin_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Zahin_API_KEY not configured. Add it to your Vercel environment variables." },
        { status: 500 }
      );
    }

    const { input } = await request.json();

    if (!input || !input.trim()) {
      return NextResponse.json({ error: "No input provided." }, { status: 400 });
    }

    if (input.trim().length < 30) {
      return NextResponse.json({ error: "Input too short. Please paste the full abstract or a paper title with context." }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1200,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Please summarize this research paper:\n\n${input.trim()}` },
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

    // Parse JSON — strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({ summary: parsed });
    } catch {
      // If JSON parse fails return raw text as fallback
      return NextResponse.json({ summary: null, raw });
    }
  } catch (err) {
    console.error("Summarize route error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
