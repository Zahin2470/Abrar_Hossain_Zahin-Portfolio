"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Difficulty badge ───────────────────────────────────── */
const DIFF_STYLE = {
  Beginner:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Advanced:     "bg-red-500/15 text-red-400 border-red-500/30",
};

/* ── Section card ───────────────────────────────────────── */
function SummaryCard({ icon, label, color, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className={`text-xs font-mono font-bold uppercase tracking-widest ${color}`}>{label}</span>
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
    </motion.div>
  );
}

/* ── Animated loading dots ──────────────────────────────── */
function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-500"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </div>
  );
}

/* ── Example papers ─────────────────────────────────────── */
const EXAMPLES = [
  {
    label: "Brain MRI (Zahin's paper)",
    text: `TumorXAI: Self-Supervised Deep Learning Framework for Explainable Brain MRI Tumor Classification. This paper proposes a self-supervised learning framework for classifying brain tumors from MRI scans while providing explainable AI (XAI) outputs. The model uses contrastive learning to pretrain on unlabeled MRI data, then fine-tunes on labeled tumor classes. Grad-CAM and SHAP are used to highlight which regions influenced the classification, making the model interpretable for clinical use. Results show 94.2% accuracy on the BraTS dataset, outperforming fully-supervised baselines with only 20% labeled data.`,
  },
  {
    label: "Attention Is All You Need",
    text: `Attention Is All You Need. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. The Transformer achieves 28.4 BLEU on WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles by over 2 BLEU.`,
  },
  {
    label: "AlphaFold 2",
    text: `Highly accurate protein structure prediction with AlphaFold. Proteins are essential to life, and understanding their structure is key to understanding their function. We present AlphaFold 2, a deep learning system that can predict protein structures with atomic accuracy. We have now produced structure predictions for nearly all catalogued proteins known to science, which has been integrated into a freely accessible database.`,
  },
];

/* ── Main Page ──────────────────────────────────────────── */
export default function PaperSummarizer() {
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      if (data.summary) setResult(data.summary);
      else setError("Could not parse the AI response. Please try again.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (text) => { setInput(text); setResult(null); setError(null); };
  const reset = () => { setInput(""); setResult(null); setError(null); };

  return (
    <div className="relative text-white min-h-screen pt-24 pb-20" style={{ overflowX: "hidden", background: "transparent" }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-700/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg shadow-lg">
              📄
            </div>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase">AI Paper Summarizer</p>
          </div>
          <h1 className="font-black leading-none mb-3"
            style={{ fontSize: "clamp(2rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            <span className="text-white">Paper </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Summarizer</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Paste any research paper abstract or title+description below. The AI will break it down into plain English - problem, method, findings, and why it matters.
          </p>

          {/* Powered by badge */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-xs font-mono text-zinc-400">Free · No account needed · Instant results</span>
          </div>
        </motion.div>

        {/* Input section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6">

          {/* Example buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-mono text-zinc-500 self-center">Try example:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.label} onClick={() => loadExample(ex.text)}
                className="text-xs font-mono px-3 py-1.5 border border-zinc-600 hover:border-purple-500/50 hover:bg-purple-500/10 text-zinc-500 hover:text-purple-400 rounded-lg transition-all duration-200">
                {ex.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste your paper abstract, title + description, or a DOI/arXiv link here...

Example:
TumorXAI: Self-Supervised Deep Learning Framework for Explainable Brain MRI...
Abstract: This paper proposes..."
              rows={7}
              className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-purple-500/60 rounded-2xl px-5 py-4 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none font-mono leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {input && (
                <button onClick={reset} className="text-xs font-mono text-zinc-700 hover:text-zinc-400 transition-colors">
                  clear
                </button>
              )}
              <span className="text-xs font-mono text-zinc-700">{input.length} chars</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/30"
            >
              {loading ? (
                <><LoadingDots /><span>Analyzing...</span></>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Summarize Paper
                </>
              )}
            </button>
            {result && (
              <button onClick={reset}
                className="px-5 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 text-sm font-mono text-zinc-400 hover:text-zinc-200 transition-all">
                New Paper
              </button>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-mono text-red-400">
            ⚠ {error}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Title bar */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 blur-sm" />
                <div className="relative bg-zinc-900/90 border border-zinc-700/60 rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-black text-white leading-snug max-w-2xl"
                      style={{ fontFamily: "'Syne',sans-serif" }}>
                      {result.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {result.difficulty && (
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${DIFF_STYLE[result.difficulty] || DIFF_STYLE.Intermediate}`}>
                          {result.difficulty}
                        </span>
                      )}
                      {result.domains?.map(d => (
                        <span key={d} className="text-xs font-mono px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* TL;DR */}
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-3">
                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">TL;DR</p>
                    <p className="text-sm text-zinc-200 italic">{result.tldr}</p>
                  </div>

                  {/* One liner */}
                  <p className="text-base text-zinc-300 leading-relaxed font-medium">{result.oneLiner}</p>
                </div>
              </motion.div>

              {/* Detail cards grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <SummaryCard icon="🎯" label="The Problem" color="text-red-400">
                  {result.problem}
                </SummaryCard>
                <SummaryCard icon="⚙️" label="The Method" color="text-blue-400">
                  {result.method}
                </SummaryCard>
                <SummaryCard icon="📊" label="Key Findings" color="text-emerald-400">
                  {result.findings}
                </SummaryCard>
                <SummaryCard icon="🌍" label="Why It Matters" color="text-amber-400">
                  {result.whyItMatters}
                </SummaryCard>
              </div>

              {/* Key terms */}
              {result.keyTerms?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                    🔑 Key Terms Explained
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.keyTerms.map((kt, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-700 pt-0.5">{String(i+1).padStart(2,"0")}</span>
                        <div>
                          <p className="text-xs font-bold text-purple-300 font-mono mb-0.5">{kt.term}</p>
                          <p className="text-xs text-zinc-400 leading-snug">{kt.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share / try another */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between pt-2">
                <button onClick={reset}
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  ← Summarize another paper
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
