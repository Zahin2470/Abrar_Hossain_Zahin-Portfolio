"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, projects, researchPapers } from "@/lib/data";

/* ── Animated counter hook ─────────────────────────────── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(prog * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return [count, ref];
}

/* ── Typing effect ──────────────────────────────────────── */
function TypedText({ words }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const timeout = deleting
      ? setTimeout(() => {
          setDisplayed((d) => d.slice(0, -1));
          if (displayed.length === 1) { setDeleting(false); setIdx((i) => i + 1); }
        }, 60)
      : setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length + 1));
          if (displayed === word) setTimeout(() => setDeleting(true), 1800);
        }, 100);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ── Particle grid background ───────────────────────────── */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const dots = [];
    const COLS = Math.ceil(w / 60);
    const ROWS = Math.ceil(h / 60);
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        dots.push({ x: c * 60 + 30, y: r * 60 + 30, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 });
      }
    }
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        const alpha = 0.06 + 0.08 * Math.sin(t * 0.001 * d.speed + d.phase);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ── Tilt card ──────────────────────────────────────────── */
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    setTilt({ x, y });
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHover(false); }}
      animate={{ rotateX: tilt.y, rotateY: tilt.x, scale: hover ? 1.03 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [p6, p6ref] = useCounter(projects.length);
  const [p7, p7ref] = useCounter(researchPapers.length);
  const [p8, p8ref] = useCounter(3);

  const skillMarquee = ["Python","TensorFlow","PyTorch","Pandas","OpenCV","Scikit-learn","TypeScript","React","Next.js","Tailwind","Docker","Git","Jupyter","HuggingFace","NumPy","Matplotlib"];

  return (
    <div className="bg-zinc-950 text-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated particle grid */}
        <ParticleGrid />

        {/* Radial glow blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-700/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-900/10 rounded-full blur-3xl" />
        </div>

        {/* Grid lines overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(to right, #a855f7 1px, transparent 1px), linear-gradient(to bottom, #a855f7 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: text */}
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-xs font-medium text-purple-300 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open to research collaborations
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              // Added whitespace-nowrap here to prevent any line breaks
              className="font-black leading-none mb-3 whitespace-nowrap"
              style={{ fontSize: "clamp(2.7rem, 3.7vw, 2.7rem)", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}
            >
              <span className="text-white">Abrar </span>
              <span className="text-white">Hossain </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
                Zahin
              </span>
            </motion.h1>

            {/* Typed role */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl font-mono font-light mb-6 h-8"
            >
              <TypedText words={["AI & ML Engineer", "Deep Learning Researcher", "Computer Vision Engineer", "NLP Practitioner", "Green AI Advocate"]} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-zinc-400 leading-relaxed max-w-lg mb-8"
              style={{ fontSize: "0.97rem" }}
            >
              B.Sc. in CSE student at <span className="text-purple-300 font-medium">East West University, Dhaka, Bangladesh</span> <br></br>Building Intelligent Systems for Healthcare, Environment & Education using ML, DL, NLP & Computer Vision.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="group relative px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-sm hover:text-zinc-300 transition-all duration-200"
              >
                Resume ↗
              </a>
            </motion.div>

            {/* Social row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="flex gap-3 flex-wrap"
            >
              {[
                { label: "GitHub",   href: "https://github.com/Zahin2470" },
                { label: "Scholar",  href: "https://scholar.google.com/citations?user=PggflFIAAAAJ" },
                { label: "LinkedIn", href: "https://linkedin.com/in/md-abrar-hossain-zahin" },
                { label: "Kaggle",   href: "https://kaggle.com/mdabrarhossainzahin" },
                { label: "LeetCode", href: "https://leetcode.com/u/MdZahin" },
                { label: "ResearchGate", href: "https://www.researchgate.net/profile/Abrar-Zahin-7" },
                { label: "Youtube", href: "https://www.youtube.com/@Abrar_Hossain_Zahin" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-zinc-600 hover:text-purple-400 transition-colors duration-200 font-mono">
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: profile orb + floating stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center relative"
          >
            {/* Outer rings */}
            <div className="relative w-80 h-80">
              {/* Ring 3 */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-purple-500/15" />
              {/* Ring 2 */}
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-fuchsia-500/20"
                style={{ borderStyle: "dashed" }}
              >
                {/* Orbiting dot */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-500/50" />
              </motion.div>
              {/* Ring 1 */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-purple-500/30"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
              </motion.div>

              {/* Profile circle */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-900/60">
                <img src="/images/profile/developer-pic-1.png" alt="Zahin" className="w-full h-full object-cover rounded-full" />
              </div>

              {/* Floating stat badges */}
              {[
                { label: "AI Papers", value: "5+",   pos: "top-0 -right-6",   color: "from-purple-600 to-fuchsia-600" },
                { label: "Projects",  value: "10+",   pos: "bottom-4 -left-8", color: "from-blue-600 to-cyan-600" },
                { label: "EWU CSE",   value: "2022–26", pos: "bottom-0 -right-16",color: "from-emerald-600 to-teal-600" },
              ].map((b, i) => (
                <motion.div key={b.label}
                  animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                  transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute ${b.pos} bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-2.5 shadow-xl`}
                >
                  <p className={`text-lg font-black bg-gradient-to-r ${b.color} bg-clip-text text-transparent`} style={{ fontFamily: "'Syne', sans-serif" }}>{b.value}</p>
                  <p className="text-xs text-zinc-500">{b.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-600 font-mono">scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-purple-500/60 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════ */}
      <div className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { ref: null, num: 10, suffix: "+", label: "Projects Built", color: "from-purple-400 to-fuchsia-400" },
            { ref: null,  num: 5,  suffix: "+", label: "Research Papers",     color: "from-blue-400 to-cyan-400" },
            { ref: null,  num: 3,  suffix: "+", label: "Years Coding",        color: "from-emerald-400 to-teal-400" },
            { ref: null,   num: null, suffix: "∞", label: "Problems to Solve",  color: "from-amber-400 to-orange-400" },
          ].map((s, i) => (
            <div key={i} ref={s.ref} className="text-center">
              <p className={`text-4xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`} style={{ fontFamily: "'Syne', sans-serif" }}>
                {s.num !== null ? s.num : ""}{s.suffix}
              </p>
              <p className="text-xs text-zinc-500 font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SKILLS MARQUEE
      ═══════════════════════════════════════════════════ */}
      <section className="py-10 overflow-hidden border-b border-zinc-800/50">
        <div className="relative">
          {/* Left/right fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 whitespace-nowrap"
          >
            {[...skillMarquee, ...skillMarquee].map((skill, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 font-mono hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-purple-500/60" />
                {skill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2">Featured Works</p>
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
                Projects
              </h2>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-1 text-sm text-zinc-500 hover:text-purple-400 transition-colors font-mono">
              All Projects <span className="text-lg">→</span>
            </Link>
          </motion.div>

          {/* 2-column grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <TiltCard key={project.id} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="group relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-colors duration-300"
                >
                  {/* Gradient banner */}
                  <div className={`relative h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                    <span className="text-6xl select-none" style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.4))" }}>
                      {project.emoji}
                    </span>
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
                    {project.featured && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white/80 font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono border border-zinc-700/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-purple-400 hover:text-purple-300 group-hover:gap-2.5 transition-all duration-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      View on GitHub →
                    </a>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RESEARCH — terminal card style
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-zinc-900/40 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-2">Research Papers</p>
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
                Publications
              </h2>
            </div>
            <Link href="/research" className="hidden md:flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-400 transition-colors font-mono">
              All Papers <span className="text-lg">→</span>
            </Link>
          </motion.div>

          <div className="space-y-3">
            {researchPapers.map((paper, i) => (
              <motion.div key={paper.id}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="group relative flex items-start gap-5 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 cursor-default"
              >
                {/* Line number */}
                <span className="shrink-0 text-xs font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors w-5 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className={`shrink-0 w-9 h-9 bg-gradient-to-br ${paper.iconGradient} rounded-xl flex items-center justify-center text-base shadow-lg`}>
                  {paper.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-1.5 flex-wrap">
                    <span className="text-xs font-mono text-zinc-600 shrink-0 pt-0.5">PAPER</span>
                    <h3 className="text-sm font-semibold text-zinc-200 leading-snug group-hover:text-white transition-colors">
                      {paper.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 font-mono">focus: {paper.focus}</p>
                </div>

                {/* Arrow on hover */}
                <div className="shrink-0 text-zinc-800 group-hover:text-purple-400 transition-all duration-200 group-hover:translate-x-1">
                  →
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-8 text-center">
            <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-emerald-400 hover:text-emerald-300 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
              </svg>
              View all on Google Scholar →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA / CONNECT STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4">let&apos;s_collaborate</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Open to research<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                & opportunities
              </span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto mb-10 leading-relaxed">
              ML projects, research collaborations, AI discussions, if it involves building something intelligent, I&apos;m interested.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/connect"
                className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40">
                Get in Touch
              </Link>
              <Link href="/about"
                className="px-8 py-3.5 rounded-xl border border-zinc-700 hover:border-zinc-500 font-bold text-sm text-zinc-300 hover:text-white transition-all duration-200">
                More About Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}