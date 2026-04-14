"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Suggested questions ──────────────────────────────── */
const SUGGESTIONS = [
  "What are Zahin's main research areas?",
  "Which projects is he most proud of?",
  "Is he open to internships or jobs?",
  "Tell me about his medical AI research",
  "What tech stack does he use?",
  "How can I collaborate with him?",
  "What is TumorXAI?",
  "What makes his portfolio unique?",
  "How does he design aesthetic portfolios?",
];

/* ── Typing indicator ─────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

/* ── Message bubble ───────────────────────────────────── */
function Bubble({ msg }) {
  const isUser = msg.role === "user";

  // Simple markdown: **bold** → <strong>
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* Avatar */}
      {!isUser && (
        <img
          src="/images/profile/developer-pic-1.png"
          alt="Zahin's profile"
          className="w-8 h-8 rounded-xl object-cover mr-2.5 shrink-0 mt-0.5 border border-zinc-700"
        />
      )}

      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? "bg-purple-600 text-white rounded-br-sm"
          : "bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/60"
      }`}>
        {renderText(msg.content)}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xs font-mono text-zinc-400 ml-2.5 shrink-0 mt-0.5">
          you
        </div>
      )}
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────── */

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Zahin's AI assistant. I know everything about his research, projects, skills, and background. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  // Removed auto-scroll effect to prevent any scrolling to chat box

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call our own Next.js API route — safe, server-side, no CORS issues
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Couldn't reach the AI. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const reset = () => {
    setMessages([{ role: "assistant", content: "Hi! I'm Zahin's AI assistant. I know everything about his research, projects, skills, and background. What would you like to know?" }]);
    setError(null);
  };

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-20 pb-6 flex flex-col" style={{ overflowX: "hidden" }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-700/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col flex-1">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <br></br>
              <h1 className="font-black leading-none mb-1"
                style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                <span className="text-white">Ask About </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Zahin</span>
              </h1>
            </div>
            <button onClick={reset}
              className="shrink-0 text-xs font-mono px-3 py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-300 rounded-lg transition-all">
              New Chat
            </button>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Online
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-mono text-purple-400">
              Knows all about Zahin
            </div>
            <Link href="/connect"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
              Contact Zahin directly →
            </Link>
          </div>
        </motion.div>

        {/* ── Chat window ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex-1 flex flex-col min-h-0">

          {/* Messages area */}
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl rounded-b-none p-4 sm:p-5 overflow-y-auto"
            style={{ minHeight: "360px", maxHeight: "50vh" }}>

            {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-3">
                <img
                  src="/images/profile/developer-pic-1.png"
                  alt="Zahin's profile"
                  className="w-8 h-8 rounded-xl object-cover mr-2.5 shrink-0 mt-0.5 border border-zinc-700"
                />
                <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl rounded-bl-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex justify-center mb-3">
                <div className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-full">
                  {error}
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="bg-zinc-900/80 border border-zinc-800 border-t-0 rounded-b-2xl p-3">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about research, projects, skills, collaboration..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-zinc-800/80 border border-zinc-700 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors resize-none font-mono disabled:opacity-50"
                style={{ minHeight: "42px", maxHeight: "120px" }}
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="shrink-0 w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 self-end"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
            <p className="text-[10px] font-mono text-zinc-700 mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </motion.div>

        {/* ── Suggested questions ─────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-5">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((q) => (
              <button key={q} onClick={() => send(q)} disabled={loading}
                className="text-xs font-mono px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/10 text-zinc-500 hover:text-purple-300 rounded-lg transition-all duration-200 disabled:opacity-40 text-left">
                {q}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
