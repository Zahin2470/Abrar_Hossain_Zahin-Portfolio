"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const USERNAME = "Zahin2470";

/* ── Language colours ───────────────────────────────────── */
const LANG_COLORS = {
  Python:     "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a",
  HTML:       "#e34c26", CSS:        "#563d7c", "C++":      "#f34b7d",
  C:          "#555555", Java:       "#b07219", Shell:      "#89e051",
  Jupyter:    "#DA5B0B", SCSS:       "#c6538c", Makefile:   "#427819",
  Dockerfile: "#384d54", Ruby:       "#701516", Go:         "#00ADD8",
  Rust:       "#dea584", Kotlin:     "#A97BFF", Swift:      "#ffac45",
};
const langColor = (l) => LANG_COLORS[l] || "#8b8fa8";

/* ── Time ago ───────────────────────────────────────────── */
const timeAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30)  return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

/* ── Skeleton loader ────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-zinc-800/60 rounded-lg ${className}`} />;
}

/* ── Stat pill ──────────────────────────────────────────── */
function StatPill({ label, value, color = "text-purple-400" }) {
  return (
    <div className="flex flex-col items-center bg-zinc-900/70 border border-zinc-800/60 rounded-xl px-4 py-3">
      <span className={`text-xl font-black ${color}`} style={{ fontFamily: "'Syne',sans-serif" }}>
        {value}
      </span>
      <span className="text-[10px] font-mono text-zinc-600 mt-0.5 uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ── Repo card ──────────────────────────────────────────── */
function RepoCard({ repo, index }) {
  return (
    <motion.a
      href={repo.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-2 p-4 bg-zinc-900/70 border border-zinc-800/60
                 hover:border-zinc-600/80 rounded-xl transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          <span className="text-sm font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors truncate">
            {repo.name}
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-700 shrink-0">{timeAgo(repo.updatedAt)}</span>
      </div>

      {repo.description && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{repo.description}</p>
      )}

      <div className="flex items-center gap-3 mt-auto">
        {repo.language && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h.01M8 7a2 2 0 100-4 2 2 0 000 4zM8 7v10m0 0a2 2 0 100 4 2 2 0 000-4zm0 0h8m0 0a2 2 0 100 4 2 2 0 000-4zm0-10a2 2 0 100-4 2 2 0 000 4zm0 0v10"/>
            </svg>
            {repo.forks}
          </span>
        )}
      </div>
    </motion.a>
  );
}

/* ── Contribution graph (GitHub SVG embed) ──────────────── */
function ContributionGraph() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="relative min-w-[600px]">
        {/* GitHub's public contribution graph as an image */}
        <img
          src={`https://ghchart.rshah.org/8b5cf6/${USERNAME}`}
          alt="GitHub contribution graph"
          className="w-full h-auto rounded-lg"
          style={{ filter: "brightness(0.9) saturate(1.2)" }}
          loading="lazy"
        />
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5" />
      </div>
      <p className="text-[10px] font-mono text-zinc-700 text-right mt-2">
        Contribution activity · last 12 months
      </p>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function GitHubStats() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-5"
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {loading ? (
            <Skeleton className="w-9 h-9 rounded-full" />
          ) : data?.profile.avatar ? (
            <img src={data.profile.avatar} alt={USERNAME}
              className="w-9 h-9 rounded-full border border-zinc-700" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              {loading ? <Skeleton className="w-28 h-4" /> : `@${USERNAME}`}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-600">Live Data</span>
            </div>
          </div>
        </div>
        <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-purple-400 transition-colors border border-zinc-800 hover:border-purple-500/40 px-3 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          View Profile →
        </a>
      </div>

      {/* ── Stats pills ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)
        ) : error ? (
          <p className="col-span-4 text-xs font-mono text-zinc-600 text-center py-4">
            Could not load GitHub stats
          </p>
        ) : (
          <>
            <StatPill label="Public Repos" value={data.profile.publicRepos} color="text-purple-400" />
            <StatPill label="Total Stars"  value={data.stats.totalStars}    color="text-amber-400" />
            <StatPill label="Followers"    value={data.profile.followers}   color="text-blue-400" />
            <StatPill label="Total Forks"  value={data.stats.totalForks}    color="text-emerald-400" />
          </>
        )}
      </div>

      {/* ── Contribution graph ────────────────────────────── */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
          Contribution Activity
        </p>
        <ContributionGraph />
      </div>

      {/* ── Top Languages ─────────────────────────────────── */}
      {!loading && !error && data.topLanguages.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
            Top Languages
          </p>
          {/* Stacked bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-4">
            {data.topLanguages.map(l => (
              <div key={l.name} className="rounded-sm transition-all duration-500"
                style={{ width: `${l.pct}%`, background: langColor(l.name) }}
                title={`${l.name} ${l.pct}%`} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {data.topLanguages.map((l, i) => (
              <motion.div key={l.name}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: langColor(l.name) }} />
                <span className="text-xs text-zinc-400">{l.name}</span>
                <span className="text-[10px] font-mono text-zinc-600">{l.pct}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Top Repos ─────────────────────────────────────── */}
      {!loading && !error && data.topRepos.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Top Repositories
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.topRepos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Skeleton repos while loading */}
      {loading && (
        <div className="grid sm:grid-cols-2 gap-3">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      )}

    </motion.div>
  );
}
