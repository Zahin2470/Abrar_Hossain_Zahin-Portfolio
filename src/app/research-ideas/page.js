"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Difficulty config ──────────────────────────────────── */
const DIFF_CONFIG = {
  MSc:      { color: "text-emerald-200", bg: "bg-emerald-500/10 border-emerald-200/30" },
  PhD:      { color: "text-amber-200",   bg: "bg-amber-500/10 border-amber-500/30" },
  Industry: { color: "text-blue-200",    bg: "bg-blue-500/10 border-blue-500/30" },
};

/* ── Preset topic suggestions ───────────────────────────── */
const PRESET_TOPICS = [
  { label: "Medical Imaging",       icon: "🧠", desc: "Brain scans, cancer detection, XAI" },
  { label: "Green AI",              icon: "🌱", desc: "Sustainable ML, edge computing" },
  { label: "Post-Quantum Crypto",   icon: "🔐", desc: "Quantum-safe protocols, TLS" },
  { label: "Computer Vision",       icon: "👁️", desc: "Object detection, segmentation" },
  { label: "NLP & LLMs",           icon: "💬", desc: "Language models, retrieval" },
  { label: "Cybersecurity",         icon: "🛡️", desc: "Intrusion detection, malware" },
  { label: "Drone & Satellite AI",  icon: "🛸", desc: "Remote sensing, UAV analysis" },
  { label: "Federated Learning",    icon: "🔗", desc: "Privacy-preserving ML" },
  { label: "Explainable AI",        icon: "🔍", desc: "Interpretability, SHAP, Grad-CAM" },
  { label: "Healthcare AI",         icon: "🏥", desc: "Clinical decision support" },
  { label: "Reinforcement Learning",icon: "🎮", desc: "Agents, reward design" },
  { label: "Data Augmentation",     icon: "📊", desc: "Synthetic data, diffusion models" },
];

/* ── Animated loading state ─────────────────────────────── */
function ThinkingLoader({ topic }) {
  const steps = [
    "Scanning research landscape...",
    "Identifying knowledge gaps...",
    "Generating novel directions...",
    "Validating methodologies...",
    "Finalizing 5 research ideas...",
  ];
  const [step, setStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => setStep(s => (s + 1) % steps.length), 1200);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Pulsing brain icon */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl"
      >
        🧠
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-mono text-purple-200 mb-2">Generating Ideas for: <strong className="text-white">{topic}</strong></p>
        <AnimatePresence mode="wait">
          <motion.p key={step}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="text-xs font-mono text-zinc-500">
            {steps[step]}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* Loading bar */}
      <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
          animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </div>
  );
}

/* ── Single idea card ───────────────────────────────────── */
function IdeaCard({ idea, index }) {
  const [expanded, setExpanded] = useState(false);
  const diff = DIFF_CONFIG[idea.difficulty] || DIFF_CONFIG.PhD;

  const cardColors = [
    "from-purple-600/20 to-fuchsia-600/10",
    "from-blue-600/20 to-cyan-600/10",
    "from-emerald-600/20 to-teal-600/10",
    "from-amber-600/20 to-orange-600/10",
    "from-rose-600/20 to-pink-600/10",
  ];
  const accentColors = [
    "text-purple-400", "text-blue-400", "text-emerald-400", "text-amber-400", "text-rose-400",
  ];
  const borderColors = [
    "border-purple-500/30", "border-blue-500/30", "border-emerald-500/30", "border-amber-500/30", "border-rose-500/30",
  ];

  const color = accentColors[index % 5];
  const border = borderColors[index % 5];
  const grad = cardColors[index % 5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Glow */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />

      <div className={`relative bg-zinc-900/90 border ${border} rounded-2xl overflow-hidden transition-colors duration-300`}>

        {/* Card header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-6 hover:bg-white/2 transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* Number */}
            <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${grad} border ${border} flex items-center justify-center font-black text-sm ${color}`}
              style={{ fontFamily: "'Syne',sans-serif" }}>
              {String(idea.id).padStart(2, "0")}
            </div>

            <div className="flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color}`}>
                  {idea.difficulty}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">
                  ⏱ {idea.timeEstimate}
                </span>
                {idea.domains?.slice(0, 2).map(d => (
                  <span key={d} className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${border} ${color} bg-white/3`}>{d}</span>
                ))}
              </div>

              {/* Title */}
              <h3 className={`font-black text-base leading-snug mb-1.5 group-hover:${color} transition-colors`}
                style={{ fontFamily: "'Syne',sans-serif" }}>
                {idea.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{idea.tagline}</p>
            </div>

            {/* Expand chevron */}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}
              className={`shrink-0 w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center ${color} text-xs mt-1`}>
              ↓
            </motion.div>
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-zinc-800">
                <div className="pt-4 grid sm:grid-cols-2 gap-4">

                  {/* Problem */}
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color} mb-2`}>🎯 The Problem</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{idea.problem}</p>
                  </div>

                  {/* Methodology */}
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color} mb-2`}>⚙️ Methodology</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{idea.methodology}</p>
                  </div>

                  {/* Novelty */}
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color} mb-2`}>✨ What&apos;s Novel</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{idea.novelty}</p>
                  </div>

                  {/* Expected outcome */}
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color} mb-2`}>📊 Expected Outcome</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{idea.expectedOutcome}</p>
                  </div>
                </div>

                {/* Keywords */}
                {idea.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-zinc-600 self-center">Keywords:</span>
                    {idea.keywords.map(kw => (
                      <span key={kw} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function ResearchIdeas() {
  const [topic, setTopic]       = useState("");
  const [context, setContext]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [showContext, setShowContext] = useState(false);

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/research-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), context: context.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      if (data.result) setResult(data.result);
      else setError("Could not parse the AI response. Please try again.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setTopic(""); setContext(""); setResult(null); setError(null); };
  const selectPreset = (label) => { setTopic(label); setResult(null); setError(null); };

  return (
    <div className="relative text-white min-h-screen pt-24 pb-20" style={{ overflowX: "hidden", background: "transparent" }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg shadow-lg">
              💡
            </div>
            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase">AI Research Idea Generator</p>
          </div>
          <h1 className="font-black leading-none mb-3"
            style={{ fontSize: "clamp(2rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            <span className="text-white">Research </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Idea Generator</span>
          </h1>
          <p className="text-zinc-200 text-sm leading-relaxed max-w-2xl">
            Enter any research topic and get 5 novel, publishable research directions - each with a clear problem statement, methodology, novelty factor, and expected outcomes.
          </p>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100/30 bg-blue-500/10 text-xs font-mono text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse" />
            </div>
            <span className="text-xs font-mono text-zinc-200">Multiple Ideas · Full methodology · Click to expand</span>
          </div>
        </motion.div>

        {/* Input section */}
        <AnimatePresence>
          {!loading && !result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="mb-8">

              {/* Preset chips */}
              <p className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest mb-3">Quick select a topic:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
                {PRESET_TOPICS.map((preset) => (
                  <button key={preset.label} onClick={() => selectPreset(preset.label)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 group ${
                      topic === preset.label
                        ? "border-purple-500/60 bg-purple-500/15 text-purple-300"
                        : "border-purple-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 bg-zinc-900/40"
                    }`}>
                    <span className="text-lg shrink-0 mt-0.5">{preset.icon}</span>
                    <div>
                      <p className="text-xs font-semibold leading-tight">{preset.label}</p>
                      <p className="text-[10px] font-mono text-zinc-600 mt-0.5">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Text input */}
              <div className="mb-3">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                  Or type your own topic:
                </label>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="e.g. Vision Transformers for low-resolution images, Quantum ML, Neuromorphic computing..."
                  className="w-full bg-zinc-900/80 border border-purple-800 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors font-mono"
                />
              </div>

              {/* Optional context */}
              <div className="mb-5">
                <button onClick={() => setShowContext(!showContext)}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-400 transition-colors mb-2 flex items-center gap-1">
                  {showContext ? "▾" : "▸"} Add context (optional)
                </button>
                <AnimatePresence>
                  {showContext && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <textarea
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        placeholder="Describe your existing work, constraints, or specific angles you're interested in..."
                        rows={3}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none font-mono"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!topic.trim() || loading}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-80 disabled:cursor-not-allowed font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Generate 5 Research Ideas
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-mono text-red-400">
            ⚠ {error}
            <button onClick={reset} className="ml-4 text-zinc-400 hover:text-white underline">Try again</button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && <ThinkingLoader topic={topic} />}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Topic overview */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative mb-8">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/15 blur-sm" />
                <div className="relative bg-zinc-900/90 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">Research Area</p>
                      <h2 className="font-black text-2xl text-white mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>
                        {result.topic}
                      </h2>
                      <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{result.overview}</p>
                    </div>
                    <button onClick={reset}
                      className="shrink-0 text-xs font-mono px-4 py-2 border border-zinc-700 hover:border-blue-500/60 text-zinc-500 hover:text-blue-400 rounded-xl transition-all">
                      ← New Topic
                    </button>
                  </div>

                  {/* Hot topics + datasets */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-zinc-800">
                    {result.hotTopics?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">🔥 Trending Sub-Topics</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.hotTopics.map(t => (
                            <span key={t} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.suggestedDatasets?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">📦 Key Datasets</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.suggestedDatasets.map(d => (
                            <span key={d} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pro tip */}
                  {result.tip && (
                    <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs font-mono text-purple-400 mb-1">💡 Pro Tip</p>
                      <p className="text-sm text-zinc-300">{result.tip}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 5 Idea cards */}
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">
                5 Research Directions · Click any card to expand methodology
              </p>
              <div className="space-y-4">
                {result.ideas?.map((idea, i) => (
                  <IdeaCard key={idea.id} idea={idea} index={i} />
                ))}
              </div>

              {/* Footer */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-between flex-wrap gap-3">
                <button onClick={reset}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
                  ← Generate for another topic
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
