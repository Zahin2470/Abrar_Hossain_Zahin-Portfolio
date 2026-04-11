"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";

const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

/* ── Animated grid background ───────────────────────────── */
function GridBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-700/8 rounded-full blur-3xl" />
    </div>
  );
}

/* ── 3-D tilt card ──────────────────────────────────────── */
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width  - 0.5) * 14,
      y: ((e.clientY - r.top)  / r.height - 0.5) * -14,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      animate={{ rotateX: tilt.y, rotateY: tilt.x, scale: hovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Project card ───────────────────────────────────────── */
function ProjectCard({ project, index }) {
  return (
    <TiltCard className="h-full">
      <motion.div
        layout
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        className="group relative h-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden flex flex-col transition-colors duration-300"
      >
        {/* Gradient glow behind card on hover */}
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-15 blur transition-opacity duration-500 pointer-events-none`} />

        {/* Banner */}
        <div className={`relative h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          {/* Index number watermark */}
          <span className="absolute top-3 left-4 text-7xl font-black text-white/10 select-none leading-none"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Emoji */}
          <span className="relative text-6xl select-none group-hover:scale-110 transition-transform duration-500"
            style={{ filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.5))" }}>
            {project.emoji}
          </span>
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider">Featured</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="relative p-6 flex flex-col flex-1">
          {/* Title row */}
          <div className="mb-3">
            <h3 className="text-xl font-black text-white leading-tight group-hover:text-purple-200 transition-colors duration-200"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{project.descriptionLong}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700/60 group-hover:border-zinc-600 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/80">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-purple-400 transition-colors group/link">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span className="group-hover/link:translate-x-0.5 transition-transform">GitHub →</span>
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-emerald-400 transition-colors">
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));
  const featured = projects.filter((p) => p.featured).length;

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-24 pb-24 overflow-hidden">
      <GridBg />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mb-14">
          <h1 className="font-black leading-none mb-5"
            style={{ fontSize: "clamp(2rem, 3vw, 3.5rem)", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em" }}>
            <span className="block text-white">Things I&apos;ve</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
              Built
            </span>
          </h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            From AI-powered healthcare platforms to Chrome extensions and real-time apps, each project solves a real problem.
          </p>
        </motion.div>

        {/* ── Stats strip ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-12">
          {[
            { num: projects.length,                   label: "Total Projects",  color: "from-purple-400 to-fuchsia-400" },
            { num: featured,                           label: "Featured",        color: "from-emerald-400 to-teal-400" },
            { num: Array.from(new Set(projects.flatMap(p => p.tags))).length, label: "Technologies", color: "from-blue-400 to-cyan-400" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}
                style={{ fontFamily: "'Syne', sans-serif" }}>{s.num}</p>
              <p className="text-xs font-mono text-zinc-600">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Filter bar ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setActive(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                active === tag
                  ? "bg-purple-600 text-white border border-purple-500"
                  : "border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-zinc-900/60"
              }`}>
              {active === tag && <span className="mr-1">▸</span>}
              {tag}
            </button>
          ))}
        </motion.div>

        {/* ── Project grid ────────────────────────────────── */}
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-600 font-mono py-20">
            No projects found for &quot;{active}&quot;
          </p>
        )}

        {/* ── GitHub CTA ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-sm" />
          <div className="relative bg-zinc-900/80 border border-zinc-700/60 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                All Projects on GitHub
              </h3>
              <p className="text-sm text-zinc-500">Browse source code, issues, and commit history</p>
            </div>
            <a href="https://github.com/Zahin2470" target="_blank" rel="noopener noreferrer"
              className="shrink-0 group flex items-center gap-3 px-7 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 font-bold text-sm transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Visit GitHub Profile
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
