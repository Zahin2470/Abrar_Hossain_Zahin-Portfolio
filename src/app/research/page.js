"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { researchPapers } from "@/lib/data";

const areaColors = {
  "Medical AI":      "from-rose-500 to-pink-500",
  "XAI":             "from-violet-500 to-purple-500",
  "Deep Learning":   "from-blue-500 to-indigo-500",
  "Green AI":        "from-emerald-500 to-teal-500",
  "Computer Vision": "from-amber-500 to-orange-500",
  "NLP":             "from-cyan-500 to-blue-500",
  "Cryptography":    "from-fuchsia-500 to-purple-500",
  "Security":        "from-red-500 to-rose-500",
};

const allAreas = ["All", ...Array.from(new Set(researchPapers.flatMap((p) => p.tags)))];

function HexBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
        <defs>
          <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 50,14 50,34 28,46 6,34 6,14"
              fill="none" stroke="#a855f7" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl" />
    </div>
  );
}

function PaperCard({ paper, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative"
    >
      {/* Glow on hover */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${paper.iconGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`} />

      <div
        onClick={() => setExpanded(!expanded)}
        className="relative bg-zinc-900/90 border border-zinc-800 group-hover:border-zinc-600 rounded-2xl p-6 cursor-pointer transition-all duration-300 select-none"
      >
        {/* Top row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Index number */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-xs font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <div className={`w-10 h-10 bg-gradient-to-br ${paper.iconGradient} rounded-xl flex items-center justify-center text-lg shadow-lg`}>
              {paper.emoji}
            </div>
          </div>

          {/* Title + badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase border border-purple-500/30 px-2 py-0.5 rounded-full bg-purple-500/10">
                Research Paper
              </span>
              {paper.url && (
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                  Published
                </span>
              )}
            </div>
            <h3 className="text-sm md:text-base font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors">
              {paper.title}
            </h3>
          </div>

          {/* Expand arrow */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-600 group-hover:border-zinc-500 group-hover:text-zinc-400 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </motion.div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 ml-14">
          {paper.tags.map((tag) => {
            const grad = areaColors[tag] || "from-zinc-500 to-zinc-600";
            return (
              <span key={tag}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} bg-opacity-20 text-white/80 border border-white/10`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 ml-14 pt-5 border-t border-zinc-800">
                {/* Focus line — styled as terminal output */}
                <div className="bg-zinc-950 rounded-xl p-4 mb-4 font-mono border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"/>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"/>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"/>
                    </div>
                    <span className="text-xs text-zinc-600">focus.txt</span>
                  </div>
                  <p className="text-xs text-emerald-400">
                    <span className="text-zinc-600">$ </span>
                    {paper.focus}
                  </p>
                </div>

                {paper.url ? (
                  <a href={paper.url} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/60 px-4 py-2 rounded-lg bg-purple-500/10 transition-all"
                  >
                    View Paper ↗
                  </a>
                ) : (
                  <p className="text-xs font-mono text-zinc-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 animate-pulse"/>
                    Under review / coming soon
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Research() {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All"
    ? researchPapers
    : researchPapers.filter((p) => p.tags.includes(activeTag));

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-24 pb-24 overflow-hidden">
      <HexBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4">
          </p>
          <h1
            className="font-black leading-none mb-6"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em" }}
          >
            <span className="block text-white">Research &</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
              Publications
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            Academic contributions spanning medical imaging, explainable AI,<br className="hidden md:block"/>
            green computing, and post-quantum cryptography.
          </p>
        </motion.div>

        {/* ── Research area filter ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {allAreas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveTag(area)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                activeTag === area
                  ? "bg-purple-600 text-white border border-purple-500"
                  : "border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-zinc-900/60"
              }`}
            >
              {activeTag === area && <span className="mr-1">▸</span>}
              {area}
            </button>
          ))}
        </motion.div>

        {/* ── Stats strip ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {[
            { num: researchPapers.length, label: "Total Papers",   color: "from-purple-400 to-fuchsia-400" },
            { num: researchPapers.filter(p => p.url).length || "1", label: "Published",  color: "from-emerald-400 to-teal-400" },
            { num: Array.from(new Set(researchPapers.flatMap(p => p.tags))).length, label: "Research Areas", color: "from-blue-400 to-cyan-400" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}
                style={{ fontFamily: "'Syne', sans-serif" }}>
                {s.num}
              </p>
              <p className="text-xs font-mono text-zinc-600">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Paper cards ──────────────────────────────────── */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((paper, i) => (
              <PaperCard key={paper.id} paper={paper} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-600 font-mono py-20">
            No papers found for &quot;{activeTag}&quot;
          </p>
        )}

        {/* ── Google Scholar CTA ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-sm" />
          <div className="relative bg-zinc-900/80 border border-zinc-700/60 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2">
              </p>
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                Google Scholar
              </h3>
              <p className="text-sm text-zinc-500">
                View citation counts, co-authors & full publication list
              </p>
            </div>
            <a
              href="https://scholar.google.com/citations?user=PggflFIAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 group flex items-center gap-3 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
              </svg>
              Open Scholar Profile
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
