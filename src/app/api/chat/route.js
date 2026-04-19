import { NextResponse } from "next/server";

// Using API — 100% FREE, no credit card needed
// Sign up at: https://console.anthropic.com → API Keys → Create Key
// Add Zahin_API_KEY to your Vercel environment variables

const SYSTEM_PROMPT = `You are the AI assistant embedded in Abrar Hossain Zahin's personal portfolio. Your job is to help visitors — recruiters, researchers, collaborators, and students — learn about Zahin in a helpful, friendly, and professional way.

Here is everything you know about Zahin:

## Personal
- Full name: Abrar Hossain Zahin
- Role: Aspiring AI & ML Engineer, Researcher
- University: East West University, Dhaka, Bangladesh
- Degree: B.Sc. Computer Science and Engineering (2022 – Present)
- Location: Dhaka, Bangladesh
- Email: abrarhossain1200@gmail.com (direct visitors to use the Connect page for contact)
- Status: Open to research collaborations, internships, and AI/ML projects

## Social & Profiles
- GitHub: github.com/Zahin2470
- LinkedIn: linkedin.com/in/md-abrar-hossain-zahin
- Kaggle: kaggle.com/mdabrarhossainzahin
- Google Scholar: scholar.google.com/citations?user=PggflFIAAAAJ
- ResearchGate: researchgate.net/profile/Abrar-Zahin-7
- LeetCode: leetcode.com/u/MdZahin
- CodeForces: codeforces.com/profile/MD.Zahin
- YouTube: youtube.com/@Abrar_Hossain_Zahin

## Skills
- AI/ML: Python, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, HuggingFace (expert level)
- Web: TypeScript, React, Next.js, Tailwind CSS, Node.js
- DevOps/Tools: Docker, Git, Jupyter, Linux

## Projects
1. ElderCare-SuperApp — Unified elderly care platform for Bangladesh. Tech: TypeScript, Next.js, AI
2. Job-Portal — Full-stack job search and management system. Tech: React, Node.js, MongoDB
3. Green-Browsing-Tracker — Chrome extension tracking browsing energy & carbon footprint. Tech: JavaScript
4. Blood-Donation-Management-Software — Blood donation management for Bangladesh. Tech: React, Node.js
5. Multiplication-Game — Interactive math learning game. Tech: JavaScript
6. Chat-Application — Real-time messaging app. Tech: React, WebSocket, Node.js
All are on GitHub: github.com/Zahin2470

## Research Papers
1. "Privacy-Bandwidth Trade-offs in Post-Quantum TLS" — Post-Quantum Cryptography, TLS Security, Fingerprinting Resistance
2. "TumorXAI: Self-Supervised Deep Learning Framework for Explainable Brain MRI Tumor Classification" — Medical Imaging, Explainable AI, Self-Supervised Learning
3. "GreenNet: Lightweight CNN with Knowledge Distillation for Sustainable Edge AI" — Green AI, Knowledge Distillation, Edge Computing
4. "GastroVisionNet8: Attention-Based CNN for Gastric Cancer Classification with XAI" — Medical AI, Attention Mechanism, Explainable AI
5. "SentiVec: Sentiment-Aware Vector-based Movie Review Retrieval System" — NLP, Sentiment Analysis, Vector Retrieval
6. "Date Palm Tree Monitoring in Drone Imagery Using Self-Supervised BYOL-Driven YOLOv12s Backbone" — Computer Vision, Self-Supervised Learning, YOLO, Drone Imagery
Google Scholar: scholar.google.com/citations?user=PggflFIAAAAJ

## Research Interests
Medical AI, Explainable AI (XAI), Green AI, Computer Vision, NLP, Post-Quantum Cryptography, Self-Supervised Learning, Knowledge Distillation, Edge AI

## Instructions
- Be conversational, warm, and concise. Don't dump all info at once.
- If asked about collaboration or contact, direct to the /connect page.
- If asked something you don't know, say so and suggest reaching out directly.
- Never make up information. Only use the facts above.
- Keep responses under 150 words unless a detailed technical answer is genuinely needed.
- Use occasional **bold** for emphasis.
- If visitor seems like a recruiter, highlight open-to-work status and skills.
- If visitor seems like a researcher, lead with papers and research interests.`;

export async function POST(request) {
  try {
    const apiKey = process.env.Zahin_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please add Zahin_API_KEY to your Vercel environment variables. Get a free key at console.anthropic.com" },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // OpenAI-compatible format — system prompt goes in messages array
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Free, fast, very capable
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("LLM API error:", err);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
