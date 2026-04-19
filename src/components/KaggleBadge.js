"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ── Tier config ────────────────────────────────────────── */
const TIER_STYLES = {
  Novice:      { bg: "from-zinc-700 to-zinc-600",    border: "border-zinc-500/40",   text: "text-zinc-300",   icon: "⚪" },
  Contributor: { bg: "from-blue-700 to-blue-600",    border: "border-blue-400/40",   text: "text-blue-300",   icon: "🔵" },
  Expert:      { bg: "from-purple-700 to-purple-600",border: "border-purple-400/40", text: "text-purple-300", icon: "🟣" },
  Master:      { bg: "from-amber-700 to-amber-600",  border: "border-amber-400/40",  text: "text-amber-300",  icon: "🥇" },
  Grandmaster: { bg: "from-red-700 to-red-600",      border: "border-red-400/40",    text: "text-red-300",    icon: "🏆" },
};

/* ── Medal dot row ──────────────────────────────────────── */
function MedalRow({ label, medals }) {
  const total = medals.gold + medals.silver + medals.bronze;
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
      <span className="text-xs font-mono text-zinc-500">{label}</span>
      <div className="flex items-center gap-2">
        {total === 0 ? (
          <span className="text-xs font-mono text-zinc-700">—</span>
        ) : (
          <>
            {medals.gold   > 0 && <span className="flex items-center gap-1 text-xs font-mono"><span className="text-amber-400">🥇</span><span className="text-amber-300">{medals.gold}</span></span>}
            {medals.silver > 0 && <span className="flex items-center gap-1 text-xs font-mono"><span className="text-zinc-300">🥈</span><span className="text-zinc-300">{medals.silver}</span></span>}
            {medals.bronze > 0 && <span className="flex items-center gap-1 text-xs font-mono"><span className="text-orange-400">🥉</span><span className="text-orange-300">{medals.bronze}</span></span>}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Tier progress bar ──────────────────────────────────── */
function TierProgress({ tier }) {
  const tiers = ["Novice", "Contributor", "Expert", "Master", "Grandmaster"];
  const idx = tiers.indexOf(tier);
  return (
    <div className="flex items-center gap-1 mt-3">
      {tiers.map((t, i) => (
        <div key={t} className="flex-1 flex flex-col items-center gap-1">
          <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i <= idx ? "bg-purple-500" : "bg-zinc-800"}`} />
          {i === idx && <span className="text-[8px] font-mono text-purple-400 whitespace-nowrap">{t}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function KaggleBadge() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/kaggle")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const tier = data?.tier || "Contributor";
  const style = TIER_STYLES[tier] || TIER_STYLES.Contributor;

  if (loading) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-zinc-800" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-zinc-800 rounded w-2/3" />
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-3 bg-zinc-800 rounded" />)}
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  const totalMedals = Object.values(data.medals).reduce(
    (acc, m) => ({ gold: acc.gold + m.gold, silver: acc.silver + m.silver, bronze: acc.bronze + m.bronze }),
    { gold: 0, silver: 0, bronze: 0 }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Glow */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />

      <div className={`relative bg-zinc-900/80 border ${style.border} rounded-2xl p-6 transition-colors duration-300`}>

        {/* Header: avatar + name + tier */}
        <div className="flex items-start gap-4 mb-5">
          {/* Kaggle K icon + tier badge */}
          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-lg shrink-0`}>
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336z"/>
            </svg>
            {/* Live indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-900 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-bold text-zinc-100 truncate">{data.displayName}</span>
              {data.isFallback && (
                <span className="text-[9px] font-mono text-zinc-600 border border-zinc-700 px-1.5 py-0.5 rounded">static</span>
              )}
            </div>
            <p className="text-xs font-mono text-zinc-500 mb-2">@{data.username}</p>

            {/* Tier badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${style.bg} bg-opacity-20 border ${style.border}`}>
              <span className="text-sm">{style.icon}</span>
              <span className={`text-xs font-bold ${style.text}`}>{tier}</span>
            </div>
          </div>
        </div>

        {/* Tier progress */}
        <TierProgress tier={tier} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-5 mb-4">
          {[
            { label: "Votes",     val: data.totalVotes },
            { label: "Followers", val: data.followers  },
            { label: "Following", val: data.following  },
          ].map((s) => (
            <div key={s.label} className="text-center bg-zinc-950/60 rounded-xl py-3 border border-zinc-800">
              <p className="text-lg font-black text-zinc-100" style={{ fontFamily: "'Syne',sans-serif" }}>{s.val}</p>
              <p className="text-[9px] font-mono text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Medals by category */}
        <div className="mb-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Medals by Category</p>
          <div className="bg-zinc-950/60 rounded-xl px-4 py-1 border border-zinc-800">
            <MedalRow label="Competitions" medals={data.medals.competitions} />
            <MedalRow label="Notebooks"    medals={data.medals.notebooks}    />
            <MedalRow label="Datasets"     medals={data.medals.datasets}     />
            <MedalRow label="Discussions"  medals={data.medals.discussions}  />
          </div>
        </div>

        {/* Total medals summary */}
        {(totalMedals.gold + totalMedals.silver + totalMedals.bronze) > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            {totalMedals.gold   > 0 && <span className="text-sm font-mono text-amber-400">🥇 {totalMedals.gold} Gold</span>}
            {totalMedals.silver > 0 && <span className="text-sm font-mono text-zinc-300">🥈 {totalMedals.silver} Silver</span>}
            {totalMedals.bronze > 0 && <span className="text-sm font-mono text-orange-400">🥉 {totalMedals.bronze} Bronze</span>}
          </div>
        )}

        {/* CTA link */}
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-700 hover:border-purple-500/60 hover:bg-purple-500/10 text-xs font-mono text-zinc-400 hover:text-purple-300 transition-all duration-200"
        >
          View Full Kaggle Profile ↗
        </a>

      </div>
    </motion.div>
  );
}
