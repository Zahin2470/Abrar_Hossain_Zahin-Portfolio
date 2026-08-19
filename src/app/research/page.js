"use client";
import { useState } from "react";
import { researchPapers } from "@/lib/data";

const areaColors = {
  "Medical AI":         "from-rose-500 to-pink-500",
  "XAI":                "from-violet-500 to-purple-500",
  "Deep Learning":      "from-blue-500 to-indigo-500",
  "Green AI":           "from-emerald-500 to-teal-500",
  "Computer Vision":    "from-amber-500 to-orange-500",
  "NLP":                "from-cyan-500 to-blue-500",
  "Cryptography":       "from-fuchsia-500 to-purple-500",
  "Security":           "from-red-500 to-rose-500",
  "Post-Quantum":       "from-violet-500 to-indigo-500",
  "Multimodal":         "from-pink-500 to-fuchsia-500",
  "Federated Learning": "from-blue-500 to-cyan-500",
  "Bengali":            "from-green-500 to-teal-500",
  "Drone":              "from-amber-500 to-yellow-500",
  "MRI":                "from-rose-500 to-red-500",
  "Attention":          "from-purple-500 to-violet-500",
  "Privacy":            "from-slate-500 to-zinc-500",
  "Clinical AI":        "from-red-500 to-pink-500",
};

const allAreas = [
  "All",
  ...Array.from(new Set(researchPapers.flatMap(p => p.tags))),
];

function PaperCard({ paper, index }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Formats index as 01, 02, 03... without extra words or totals
  const badgeText = String(index + 1).padStart(2, "0");

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{ backgroundColor: "#18181b", color: "#ffffff" }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer
        select-none transition-all duration-300 border
        ${expanded
          ? "!border-purple-500/60 shadow-lg shadow-purple-500/10"
          : "!border-purple-800 hover:!border-purple-500/50"}`}
    >
      {/* Image banner */}
      {paper.image && !imgError ? (
        <div className="relative w-full h-44 overflow-hidden" style={{ backgroundColor: "#09090b" }}>
          <img
            src={paper.image}
            alt={paper.title}
            className="w-full h-full object-cover transition-transform
              duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t
            from-zinc-900 via-zinc-900/20 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span
              style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", color: "#e4e4e7" }}
              className="text-[10px] font-mono tracking-widest uppercase
                border border-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm block">
              {badgeText}
            </span>
          </div>
          {paper.url && (
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", color: "#34d399" }}
              className="absolute top-3 right-3 flex items-center gap-1.5
                text-[9px] font-mono border border-emerald-500/30
                px-2 py-0.5 rounded-full backdrop-blur-sm">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Published
            </div>
          )}
        </div>
      ) : (
        /* Fallback section */
        <div className={`w-full h-28 bg-gradient-to-br
          ${paper.iconGradient} flex items-center justify-center relative`}>
          <span className="text-5xl select-none">{paper.emoji}</span>
          <div className="absolute top-3 left-3">
            <span
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "#ffffff" }}
              className="text-[10px] font-mono tracking-widest uppercase
                border border-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm block">
              {badgeText}
            </span>
          </div>
          {paper.url && (
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "#34d399" }}
              className="absolute top-3 right-3 flex items-center gap-1.5
                text-[9px] font-mono border border-emerald-500/30
                px-2 py-0.5 rounded-full backdrop-blur-sm">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Published
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span
                style={{ backgroundColor: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}
                className="text-[9px] font-mono tracking-widest
                  uppercase border border-purple-500/30 px-2 py-0.5
                  rounded-full">
                Research Paper
              </span>
            </div>
            <h3
              style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", color: "#f4f4f5" }}
              className="text-sm font-semibold leading-snug group-hover:!text-white transition-colors">
              {paper.title}
            </h3>
          </div>
          <div className={`shrink-0 w-7 h-7 rounded-full border flex items-center
            justify-center transition-all duration-300 mt-0.5
            ${expanded
              ? "border-purple-500 text-purple-400 bg-purple-500/10"
              : "border-purple-800 text-zinc-400 group-hover:border-zinc-300"}`}>
            <span className="text-xs" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", display: "block", transition: "transform 0.3s" }}>↓</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map(tag => {
            const grad = areaColors[tag] || "from-zinc-500 to-zinc-600";
            return (
              <span key={tag}
                style={{ color: "#f4f4f5" }}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full
                  bg-gradient-to-r ${grad} bg-opacity-20 border border-white/10`}>
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800/80">
          <div
            style={{ backgroundColor: "#09090b" }}
            className="rounded-xl p-4 mb-4 font-mono border border-purple-800/60 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span style={{ color: "#71717a" }} className="text-[10px]">research_focus.txt</span>
            </div>
            <p style={{ color: "#34d399" }} className="text-xs leading-relaxed">
              <span style={{ color: "#71717a" }}>$ </span>
              {paper.focus}
            </p>
          </div>
          {paper.url ? (
            <a href={paper.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#c084fc" }}
              className="inline-flex items-center gap-2 text-xs font-mono
                border border-purple-500/30 hover:border-purple-400/60
                px-4 py-2 rounded-lg transition-all duration-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              View Published Paper ↗
            </a>
          ) : (
            <p style={{ color: "#71717a" }} className="text-xs font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 animate-pulse" />
              Under review · coming soon
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Research() {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All"
    ? researchPapers
    : researchPapers.filter(p => p.tags.includes(activeTag));

  const totalAreas = Array.from(
    new Set(researchPapers.flatMap(p => p.tags))
  ).length;

  return (
    <div className="relative text-white min-h-screen pt-24 pb-24"
      style={{ background: "transparent", overflowX: "hidden" }}>

      {/* Hex background — static SVG, no animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
          <defs>
            <pattern id="hex-r" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
              <polygon points="28,2 50,14 50,34 28,46 6,34 6,14"
                fill="none" stroke="#a855f7" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-r)"/>
        </svg>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(109,40,217,0.08)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "rgba(37,99,235,0.07)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
              style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>🔬</div>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase">
              Research and Publications
            </p>
          </div>
          <h1 className="font-black leading-none mb-5"
            style={{ fontSize: "clamp(2.5rem,2.5vw,2.2rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
            <span className="text-white">Research &amp; </span>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right,#c084fc,#60a5fa)" }}>
              Publications
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed text-sm">
            Academic contributions spanning medical imaging, explainable AI,
            green computing, and post-quantum cryptography.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { dot: "bg-emerald-400", text: "Peer Reviewed",       cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
              { dot: "bg-purple-400",  text: "IEEE & Elsevier & Springer", cls: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
              { dot: "bg-blue-400",    text: "Open to Collaborate", cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
            ].map(b => (
              <div key={b.text}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${b.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${b.dot} animate-pulse`} />
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { num: researchPapers.length,                          label: "Total Papers",   color: "from-purple-400 to-fuchsia-400" },
            { num: researchPapers.filter(p => p.url).length || 1, label: "Published",      color: "from-emerald-400 to-teal-400" },
            { num: totalAreas,                                     label: "Research Areas", color: "from-blue-400 to-cyan-400" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900/60 border border-purple-800
              rounded-xl p-4 text-center transition-all duration-300
              hover:border-purple-600/60">
              <p className={`text-3xl font-black bg-gradient-to-r ${s.color}
                bg-clip-text text-transparent mb-1`}
                style={{ fontFamily: "'Syne',sans-serif" }}>
                {s.num}
              </p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allAreas.map(area => (
            <button key={area} onClick={() => setActiveTag(area)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                activeTag === area
                  ? "bg-purple-600 text-white border border-purple-500"
                  : "border border-purple-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-zinc-900/60"
              }`}>
              {activeTag === area && <span className="mr-1">▸</span>}
              {area}
            </button>
          ))}
          <span className="ml-auto self-center text-[10px] font-mono text-zinc-600
            px-3 py-1.5 border border-zinc-800 rounded-lg bg-zinc-900/40">
            {filtered.length} paper{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Cards — plain grid, zero Framer Motion */}
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((paper, i) => (
            <PaperCard key={paper.id} paper={paper} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-600 font-mono py-20">
            No papers found for &quot;{activeTag}&quot;
          </p>
        )}

        {/* Scholar CTA */}
        <div className="mt-16 relative">
          <div className="absolute -inset-px rounded-2xl blur-sm"
            style={{ background: "linear-gradient(to right,rgba(124,58,237,0.3),rgba(37,99,235,0.3))" }} />
          <div className="relative bg-zinc-900/80 border border-zinc-700/60 rounded-2xl
            p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
                </svg>
                <p className="text-xs font-mono text-purple-400 tracking-widest uppercase">
                  Google Scholar
                </p>
              </div>
              <h3 className="text-2xl font-black text-white mb-1"
                style={{ fontFamily: "'Syne',sans-serif" }}>
                Full Publication List
              </h3>
              <p className="text-sm text-zinc-500">
                View citation counts, co-authors &amp; complete academic record
              </p>
            </div>
            <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ"
              target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-3 px-7 py-3.5 rounded-xl
                bg-purple-600 hover:bg-purple-500 font-bold text-sm
                transition-colors shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
              </svg>
              Open Scholar Profile →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
