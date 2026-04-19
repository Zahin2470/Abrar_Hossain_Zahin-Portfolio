"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Skill data: 6 axes, each 0-100 ────────────────────── */
const SKILL_SETS = {
  "AI / ML": [
    { axis: "Deep Learning",    value: 88 },
    { axis: "Computer Vision",  value: 82 },
    { axis: "NLP / LLMs",       value: 78 },
    { axis: "Data Science",     value: 92 },
    { axis: "Research",         value: 85 },
    { axis: "MLOps",            value: 68 },
  ],
  "Web Dev": [
    { axis: "React / Next.js",  value: 89 },
    { axis: "TypeScript",       value: 85 },
    { axis: "Tailwind CSS",     value: 82 },
    { axis: "Node.js",          value: 68 },
    { axis: "REST APIs",        value: 72 },
    { axis: "UI/UX",            value: 85 },
  ],
  "DevOps": [
    { axis: "Git / GitHub",     value: 88 },
    { axis: "Docker",           value: 68 },
    { axis: "Linux",            value: 72 },
    { axis: "Jupyter",          value: 95 },
    { axis: "CI/CD",            value: 55 },
    { axis: "Cloud",            value: 50 },
  ],
};

const CATEGORY_COLORS = {
  "AI / ML": { stroke: "#a855f7", fill: "rgba(168,85,247,0.15)", glow: "#a855f7" },
  "Web Dev":  { stroke: "#3b82f6", fill: "rgba(59,130,246,0.15)",  glow: "#3b82f6" },
  "DevOps":   { stroke: "#10b981", fill: "rgba(16,185,129,0.15)",  glow: "#10b981" },
};

/* ── Math helpers ───────────────────────────────────────── */
function polarToCartesian(cx, cy, r, angleRad) {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  };
}

function makePolygonPoints(cx, cy, radius, values, maxVal = 100) {
  const n = values.length;
  return values.map((v, i) => {
    const angle = (2 * Math.PI * i) / n;
    const r = (v / maxVal) * radius;
    return polarToCartesian(cx, cy, r, angle);
  });
}

/* ── Animated radar polygon ─────────────────────────────── */
function RadarPolygon({ cx, cy, radius, values, color, isActive }) {
  const pts = makePolygonPoints(cx, cy, radius, values.map(v => v.value));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") + "Z";

  return (
    <motion.g>
      {/* Fill */}
      <motion.path
        d={pathD}
        fill={color.fill}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isActive ? 1 : 0.3, scale: 1 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Stroke */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color.stroke}
        strokeWidth={isActive ? 2 : 1}
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0.4 }}
        transition={{ duration: 0.5 }}
      />
      {/* Dots on vertices */}
      {isActive && pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r={4}
          fill={color.stroke}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
        />
      ))}
    </motion.g>
  );
}

/* ── Main radar chart ───────────────────────────────────── */
export default function SkillRadar() {
  const [activeCategory, setActiveCategory] = useState("AI / ML");
  const [hoveredAxis, setHoveredAxis] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const SIZE = 320;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 120; // max radius
  const LEVELS = 5;
  const categories = Object.keys(SKILL_SETS);
  const activeSkills = SKILL_SETS[activeCategory];
  const activeColor  = CATEGORY_COLORS[activeCategory];
  const n = activeSkills.length;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setAnimKey(k => k + 1);
  };

  // Grid rings
  const rings = Array.from({ length: LEVELS }, (_, i) => (i + 1) / LEVELS * R);

  // Axis labels
  const axisPoints = activeSkills.map((s, i) => {
    const angle = (2 * Math.PI * i) / n;
    const labelR = R + 24;
    const { x, y } = polarToCartesian(cx, cy, labelR, angle);
    const lineEnd   = polarToCartesian(cx, cy, R, angle);
    return { ...s, x, y, lx: lineEnd.x, ly: lineEnd.y, angle };
  });

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const col = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all duration-200 ${
                activeCategory === cat
                  ? "text-white border-transparent"
                  : "text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
              }`}
              style={activeCategory === cat ? { background: col.stroke + "30", borderColor: col.stroke + "60" } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: col.stroke }} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Chart + Legend side-by-side */}
      <div className="flex flex-col md:flex-row gap-6 items-center">

        {/* SVG Radar */}
        <div className="relative shrink-0">
          <svg
            width={SIZE} height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="overflow-visible"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background rings */}
            {rings.map((r, lvl) => {
              const pts = Array.from({ length: n }, (_, i) => {
                const angle = (2 * Math.PI * i) / n;
                return polarToCartesian(cx, cy, r, angle);
              });
              const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";
              return (
                <g key={lvl}>
                  <path d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  {/* Level label at top */}
                  <text
                    x={cx} y={cy - r - 3}
                    textAnchor="middle"
                    fontSize="8"
                    fill="rgba(255,255,255,0.2)"
                    fontFamily="monospace"
                  >
                    {((lvl + 1) * 20)}%
                  </text>
                </g>
              );
            })}

            {/* Axis lines */}
            {axisPoints.map((a, i) => (
              <line
                key={i}
                x1={cx} y1={cy}
                x2={a.lx} y2={a.ly}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            ))}

            {/* Data polygon */}
            <AnimatePresence mode="wait">
              <RadarPolygon
                key={animKey}
                cx={cx} cy={cy}
                radius={R}
                values={activeSkills}
                color={activeColor}
                isActive={true}
              />
            </AnimatePresence>

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={3} fill={activeColor.stroke} opacity={0.6} />

            {/* Axis labels — interactive */}
            {axisPoints.map((a, i) => {
              const val = a.value;
              const isHovered = hoveredAxis === i;
              // Position text anchor based on which side
              const textAnchor = a.x < cx - 5 ? "end" : a.x > cx + 5 ? "start" : "middle";

              return (
                <g key={i}
                  onMouseEnter={() => setHoveredAxis(i)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  style={{ cursor: "pointer" }}>
                  <text
                    x={a.x} y={a.y}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    fontSize={isHovered ? "10.5" : "9.5"}
                    fontWeight={isHovered ? "700" : "500"}
                    fontFamily="monospace"
                    fill={isHovered ? activeColor.stroke : "rgba(255,255,255,0.6)"}
                    style={{ transition: "all 0.2s" }}
                  >
                    {a.axis}
                  </text>
                  {/* Value tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={a.lx - 18} y={a.ly - 11}
                        width={36} height={18}
                        rx={4}
                        fill={activeColor.stroke}
                        opacity={0.9}
                      />
                      <text
                        x={a.lx} y={a.ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="monospace"
                        fill="white"
                      >
                        {val}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Glow pulse behind chart */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl -z-10 opacity-20 transition-colors duration-500"
            style={{ background: activeColor.stroke }}
          />
        </div>

        {/* Legend / skill list */}
        <div className="flex-1 w-full">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            {activeCategory} · Proficiency
          </p>
          <div className="space-y-3">
            {activeSkills.map((skill, i) => (
              <motion.div
                key={`${activeCategory}-${skill.axis}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onMouseEnter={() => setHoveredAxis(i)}
                onMouseLeave={() => setHoveredAxis(null)}
                className="group cursor-default"
              >
                <div className="flex justify-between mb-1">
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    hoveredAxis === i ? "text-white" : "text-zinc-300"
                  }`}>
                    {skill.axis}
                  </span>
                  <span
                    className="text-xs font-mono font-bold transition-colors duration-200"
                    style={{ color: hoveredAxis === i ? activeColor.stroke : "#6b7280" }}
                  >
                    {skill.value}%
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    key={`${activeCategory}-${skill.axis}-bar`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: i * 0.06, ease: "easeOut" }}
                    className="h-full rounded-full relative"
                    style={{ background: `linear-gradient(to right, ${activeColor.stroke}80, ${activeColor.stroke})` }}
                  >
                    {/* shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category summary */}
          <div className="mt-5 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-600">Avg proficiency</span>
              <span className="text-sm font-black" style={{ color: activeColor.stroke, fontFamily: "'Syne',sans-serif" }}>
                {Math.round(activeSkills.reduce((s, k) => s + k.value, 0) / activeSkills.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-700 text-center">Hover axis labels or skill names to highlight · Click category to switch view</p>
    </div>
  );
}
