"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ── Hex background — matches research page style ─────── */
function HexBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
        <defs>
          <pattern id="hex-data" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 50,14 50,34 28,46 6,34 6,14"
              fill="none" stroke="#3b82f6" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-data)"/>
      </svg>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-700/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-700/8 rounded-full blur-3xl" />
    </div>
  );
}

/* ── Color palette ───────────────────────────────────────── */
const COLORS = [
  "#a855f7","#3b82f6","#10b981","#f59e0b","#ef4444",
  "#ec4899","#06b6d4","#84cc16","#f97316","#8b5cf6",
];

/* ── CSV parser ──────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g,""));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/"/g,""));
    const row = {};
    headers.forEach((h, i) => {
      const num = parseFloat(vals[i]);
      row[h] = isNaN(num) ? vals[i] : num;
    });
    return row;
  }).filter(r => Object.values(r).some(v => v !== "" && v !== undefined));
  return { headers, rows };
}

/* ── Stats calculator ────────────────────────────────────── */
function calcStats(rows, col) {
  const nums = rows.map(r => r[col]).filter(v => typeof v === "number");
  if (!nums.length) return null;
  const sorted = [...nums].sort((a,b) => a-b);
  const mean   = nums.reduce((s,v) => s+v, 0) / nums.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length/2-1] + sorted[sorted.length/2]) / 2
    : sorted[Math.floor(sorted.length/2)];
  const variance = nums.reduce((s,v) => s + Math.pow(v-mean,2), 0) / nums.length;
  return {
    count:  nums.length,
    mean:   mean.toFixed(3),
    median: median.toFixed(3),
    std:    Math.sqrt(variance).toFixed(3),
    min:    sorted[0].toFixed(3),
    max:    sorted[sorted.length-1].toFixed(3),
    sum:    nums.reduce((s,v) => s+v, 0).toFixed(3),
  };
}

/* ── Chart types ─────────────────────────────────────────── */
const CHART_TYPES = [
  { id:"bar",     label:"Bar Chart",     icon:"📊" },
  { id:"line",    label:"Line Chart",    icon:"📈" },
  { id:"pie",     label:"Pie Chart",     icon:"🥧" },
  { id:"scatter", label:"Scatter Plot",  icon:"✦"  },
];

/* ── Custom tooltip ──────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl">
      {label !== undefined && <p className="text-xs font-mono text-zinc-500 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
export default function DataVisualizer() {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState("");
  const [chart,   setChart]   = useState("bar");
  const [xCol,    setXCol]    = useState("");
  const [yCols,   setYCols]   = useState([]);
  const [dragging,setDragging]= useState(false);
  const [tab,     setTab]     = useState("chart"); // "chart" | "stats" | "table"
  const fileRef = useRef();

  /* ── Load file ─────────────────────────────────────────── */
  const loadFile = useCallback((file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv","txt"].includes(ext)) {
      setError("Only CSV files are supported. Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      if (!parsed) { setError("Could not parse file. Please check it's a valid CSV."); return; }
      setData(parsed);
      setError("");
      // Auto-pick sensible defaults
      const numCols = parsed.headers.filter(h =>
        parsed.rows.some(r => typeof r[h] === "number")
      );
      const strCols = parsed.headers.filter(h =>
        parsed.rows.some(r => typeof r[h] === "string")
      );
      setXCol(strCols[0] || parsed.headers[0]);
      setYCols(numCols.slice(0, 2));
      setTab("chart");
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file);
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    loadFile(e.dataTransfer.files[0]);
  };

  const loadSample = () => {
    const sampleCSV = `Month,Revenue,Expenses,Profit
Jan,45000,32000,13000
Feb,52000,35000,17000
Mar,48000,31000,17000
Apr,61000,38000,23000
May,55000,36000,19000
Jun,67000,42000,25000
Jul,72000,44000,28000
Aug,69000,43000,26000
Sep,75000,46000,29000
Oct,80000,48000,32000
Nov,88000,52000,36000
Dec,95000,55000,40000`;
    loadFile(new File([sampleCSV], "sample.csv", { type: "text/csv" }));
  };

  /* ── Build chart data ──────────────────────────────────── */
  const chartData = data?.rows.slice(0, 50) || [];

  /* ── Numeric columns ───────────────────────────────────── */
  const numCols = data?.headers.filter(h =>
    data.rows.some(r => typeof r[h] === "number")
  ) || [];

  /* ── Toggle Y column ───────────────────────────────────── */
  const toggleYCol = (col) => setYCols(prev =>
    prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
  );

  /* ── Export chart as PNG ───────────────────────────────── */
  const exportChart = () => {
    const el = document.querySelector(".recharts-wrapper svg");
    if (!el) return;
    const xml  = new XMLSerializer().serializeToString(el);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "chart.svg"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Export CSV ────────────────────────────────────────── */
  const exportCSV = () => {
    if (!data) return;
    const rows = [data.headers.join(","),
      ...data.rows.map(r => data.headers.map(h => r[h] ?? "").join(","))
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative text-white min-h-screen pt-24 pb-20 overflow-hidden" style={{ background: "transparent" }}>
      <HexBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-lg">📊</div>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase">Data Visualizer</p>
          </div>
          <h1 className="font-black leading-none mb-2"
            style={{ fontSize:"clamp(2rem,3vw,3rem)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.03em" }}>
            <span className="text-white">Data </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Visualizer</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Upload a CSV File → Instant Charts, Statistics, and Export. No Account.
          </p>
        </motion.div>

        {!data ? (
          /* ── Upload zone ── */
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                dragging
                  ? "border-purple-500 bg-blue-500/10"
                  : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-900/60"
              }`}
            >
              <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden"
                onChange={e => loadFile(e.target.files[0])} />
              <div className="text-5xl mb-4">{dragging ? "📂" : "📊"}</div>
              <p className="text-lg font-semibold text-zinc-200 mb-2">Drop your CSV file here</p>
              <p className="text-sm text-zinc-500 mb-6">or click to browse · supports .csv files</p>
              <button onClick={e => { e.stopPropagation(); loadSample(); }}
                className="px-5 py-2 rounded-xl border border-zinc-700 hover:border-purple-500/50 text-xs font-mono text-zinc-400 hover:text-blue-400 transition-all">
                Load Sample Data (Monthly Revenue)
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-mono text-red-400">
                ⚠ {error}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── Dashboard ── */
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-5">

            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {data.rows.length} rows · {data.headers.length} columns
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={exportCSV}
                  className="text-xs font-mono px-3 py-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all">
                  Export CSV
                </button>
                <button onClick={exportChart}
                  className="text-xs font-mono px-3 py-1.5 border border-zinc-700 hover:border-purple-500/50 text-zinc-400 hover:text-blue-400 rounded-lg transition-all">
                  Export SVG
                </button>
                <button onClick={() => setData(null)}
                  className="text-xs font-mono px-3 py-1.5 border border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 rounded-lg transition-all">
                  New File
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-5">

              {/* Controls sidebar */}
              <div className="lg:col-span-1 space-y-4">

                {/* Chart type */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Chart Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CHART_TYPES.map(ct => (
                      <button key={ct.id} onClick={() => setChart(ct.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-mono transition-all ${
                          chart === ct.id
                            ? "border-purple-500/60 bg-purple-500/15 text-blue-300"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                        }`}>
                        <span className="text-lg">{ct.icon}</span>
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* X axis */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">X Axis</p>
                  <select value={xCol} onChange={e => setXCol(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none">
                    {data.headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* Y axis */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Y Axis (Multi-select)</p>
                  <div className="space-y-1.5">
                    {numCols.map((col, i) => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer group">
                        <div
                          onClick={() => toggleYCol(col)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            yCols.includes(col)
                              ? "border-transparent"
                              : "border-zinc-600 group-hover:border-zinc-400"
                          }`}
                          style={yCols.includes(col) ? { background: COLORS[i % COLORS.length] } : {}}>
                          {yCols.includes(col) && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">{col}</span>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="lg:col-span-3 space-y-4">

                {/* Tabs */}
                <div className="flex gap-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1 w-fit">
                  {["chart","stats","table"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        tab === t ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                      }`}>
                      {t === "chart" ? "📈 Chart" : t === "stats" ? "📐 Statistics" : "🗂 Table"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">

                  {/* Chart tab */}
                  {tab === "chart" && (
                    <motion.div key="chart"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
                    >
                      {yCols.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-zinc-600 text-sm font-mono">
                          Select at least one Y axis column →
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={360}>
                          {chart === "bar" ? (
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey={xCol} tick={{ fill:"#71717a", fontSize:11 }} axisLine={{ stroke:"#3f3f46" }} />
                              <YAxis tick={{ fill:"#71717a", fontSize:11 }} axisLine={{ stroke:"#3f3f46" }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend wrapperStyle={{ fontSize:11, color:"#a1a1aa" }} />
                              {yCols.map((col, i) => (
                                <Bar key={col} dataKey={col} fill={COLORS[i % COLORS.length]}
                                  radius={[4,4,0,0]} maxBarSize={48} />
                              ))}
                            </BarChart>
                          ) : chart === "line" ? (
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey={xCol} tick={{ fill:"#71717a", fontSize:11 }} axisLine={{ stroke:"#3f3f46" }} />
                              <YAxis tick={{ fill:"#71717a", fontSize:11 }} axisLine={{ stroke:"#3f3f46" }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend wrapperStyle={{ fontSize:11, color:"#a1a1aa" }} />
                              {yCols.map((col, i) => (
                                <Line key={col} type="monotone" dataKey={col}
                                  stroke={COLORS[i % COLORS.length]} strokeWidth={2.5}
                                  dot={{ r:3, fill:COLORS[i % COLORS.length] }} activeDot={{ r:5 }} />
                              ))}
                            </LineChart>
                          ) : chart === "pie" ? (
                            <PieChart>
                              <Pie data={chartData} dataKey={yCols[0] || numCols[0]}
                                nameKey={xCol} cx="50%" cy="50%" outerRadius={130}
                                label={({ name, percent }) => `${name}: ${(percent*100).toFixed(1)}%`}
                                labelLine={false}>
                                {chartData.map((_, i) => (
                                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          ) : (
                            <ScatterChart>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey={yCols[0] || numCols[0]} name={yCols[0]} tick={{ fill:"#71717a", fontSize:11 }} />
                              <YAxis dataKey={yCols[1] || numCols[1]} name={yCols[1]} tick={{ fill:"#71717a", fontSize:11 }} />
                              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray:"3 3" }} />
                              <Scatter data={chartData} fill={COLORS[0]} opacity={0.8} />
                            </ScatterChart>
                          )}
                        </ResponsiveContainer>
                      )}
                    </motion.div>
                  )}

                  {/* Stats tab */}
                  {tab === "stats" && (
                    <motion.div key="stats"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="space-y-3">
                      {numCols.map((col, ci) => {
                        const s = calcStats(data.rows, col);
                        if (!s) return null;
                        return (
                          <div key={col} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-3 h-3 rounded-full" style={{ background: COLORS[ci % COLORS.length] }} />
                              <p className="text-sm font-semibold text-zinc-200">{col}</p>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                              {Object.entries(s).map(([k, v]) => (
                                <div key={k} className="text-center bg-zinc-950/60 rounded-xl p-2 border border-zinc-800">
                                  <p className="text-xs font-bold text-zinc-100">{v}</p>
                                  <p className="text-[9px] font-mono text-zinc-600 uppercase">{k}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Table tab */}
                  {tab === "table" && (
                    <motion.div key="table"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-xs">
                          <thead className="bg-zinc-800/60 sticky top-0">
                            <tr>
                              <th className="px-3 py-2.5 text-left font-mono text-zinc-500 uppercase tracking-widest">#</th>
                              {data.headers.map(h => (
                                <th key={h} className="px-3 py-2.5 text-left font-mono text-zinc-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.rows.slice(0, 100).map((row, i) => (
                              <tr key={i} className="border-t border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                                <td className="px-3 py-2 font-mono text-zinc-700">{i+1}</td>
                                {data.headers.map(h => (
                                  <td key={h} className="px-3 py-2 text-zinc-300 whitespace-nowrap">
                                    {typeof row[h] === "number" ? row[h].toLocaleString() : row[h] ?? "—"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {data.rows.length > 100 && (
                          <p className="text-center text-xs font-mono text-zinc-700 py-3">
                            Showing 100 of {data.rows.length} rows
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
