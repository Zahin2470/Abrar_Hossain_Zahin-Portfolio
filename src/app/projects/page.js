"use client";
import { useState } from "react";
import { projects } from "@/lib/data";

const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.tags)))];

function ProjectCard({ project, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative rounded-2xl overflow-hidden
                    border border-zinc-800 hover:border-zinc-600
                    transition-all duration-300 bg-zinc-900/90
                    shadow-xl hover:shadow-2xl hover:shadow-purple-900/20">

      {/* Image banner */}
      <div className="relative w-full h-52 overflow-hidden">
        {project.image && !imgError ? (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform
                         duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t
              from-zinc-900/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${project.gradient}
            flex items-center justify-center`}>
            <span className="text-7xl select-none">
              {project.emoji}
            </span>
          </div>
        )}

        {/* Label */}
        {project.label && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-white/90 text-zinc-800 border border-zinc-300
            dark:bg-black/70 dark:text-zinc-100 dark:border-white/10 px-2 py-1.45 rounded-md backdrop-blur-sm shadow-lg">
            {project.label}
            </span>
          </div>
        )}

        {/* Index */}
        <div className="absolute top-0.5 right-1">
          <span className="text-[10px] font-mono font-bold text-zinc-800 bg-white/90 border border-zinc-300 dark:text-zinc-100 dark:bg-black/60 dark:border-white/10 px-0.5 py-0.5 rounded-md backdrop-blur-sm shadow-lg">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Featured */}
        {project.featured && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5
            px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-white/80 uppercase tracking-widest">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[9px] font-mono text-purple-400 uppercase tracking-widest mb-1">
          {project.featured ? "Featured Project" : "Project"}
        </p>
        <h3 className="font-black text-zinc-100 leading-tight mb-2
          group-hover:text-white transition-colors"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem" }}>
          {project.title}
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-4"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-2 py-0.5
              rounded-md bg-zinc-800 text-zinc-500 border border-zinc-700/50">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[9px] font-mono px-2 py-0.5
              rounded-md bg-zinc-800 text-zinc-600 border border-zinc-700/50">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-mono
              text-zinc-600 hover:text-purple-400 transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub →
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="text-[11px] font-mono text-emerald-600 hover:text-emerald-400 transition-colors">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All"
    ? projects
    : projects.filter(p => p.tags.includes(activeTag));

  return (
    <div className="relative text-white min-h-screen pt-24 pb-24"
      style={{ background: "transparent", overflowX: "hidden" }}>

      {/* Static backgrounds — no animation */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(168,85,247,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.03) 1px,transparent 1px)",
          backgroundSize: "72px 72px"
        }} />
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(109,40,217,0.06)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(37,99,235,0.06)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>🚀</div>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase">
              Featured Projects
            </p>
          </div>
          <h1 className="font-black leading-none mb-4"
            style={{ fontSize: "clamp(3rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
            <span className="text-white">What I&apos;ve </span>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(to right,#c084fc,#60a5fa)" }}>
              Built
            </span>
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Real-world applications spanning AI, healthcare, green technology, and developer tools.
          </p>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                activeTag === tag
                  ? "bg-purple-600 text-white border border-purple-500"
                  : "border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-zinc-900/60"
              }`}>
              {activeTag === tag && <span className="mr-1">▸</span>}
              {tag}
            </button>
          ))}
          <span className="ml-auto self-center text-[10px] font-mono text-zinc-600
            px-3 py-1.5 border border-zinc-800 rounded-lg bg-zinc-900/40">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Cards — plain div grid, no Framer Motion on cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-600 font-mono py-20">
            No projects found for &quot;{activeTag}&quot;
          </p>
        )}

        {/* GitHub CTA */}
        <div className="mt-16 relative">
          <div className="absolute -inset-px rounded-2xl blur-sm"
            style={{ background: "linear-gradient(to right,rgba(124,58,237,0.3),rgba(37,99,235,0.3))" }} />
          <div className="relative bg-zinc-900/80 border border-zinc-700/60 rounded-2xl
            p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-1"
                style={{ fontFamily: "'Syne',sans-serif" }}>More on GitHub</h3>
              <p className="text-sm text-zinc-500">
                See all repositories, contributions and open source work
              </p>
            </div>
            <a href="https://github.com/Zahin2470" target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-3 px-7 py-3.5 rounded-xl
                bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              @Zahin2470 →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
