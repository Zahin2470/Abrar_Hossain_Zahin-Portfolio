"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, projects, researchPapers } from "@/lib/data";

/* ─── Animated counter ──────────────────────────────────── */
function useCounter(target, duration = 2200) {
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
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return [count, ref];
}

/* ─── Typing effect ─────────────────────────────────────── */
function TypedText({ words }) {
  const [idx, setIdx] = useState(0);
  const [disp, setDisp] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const t = del
      ? setTimeout(() => {
          setDisp(d => d.slice(0, -1));
          if (disp.length === 1) { setDel(false); setIdx(i => i + 1); }
        }, 55)
      : setTimeout(() => {
          setDisp(word.slice(0, disp.length + 1));
          if (disp === word) setTimeout(() => setDel(true), 2000);
        }, 95);
    return () => clearTimeout(t);
  }, [disp, del, idx, words]);
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
      {disp}<span className="opacity-70 animate-pulse">|</span>
    </span>
  );
}

/* ─── Neural canvas ─────────────────────────────────────── */
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const N = 55;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      phase: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        const a = 0.08 + 0.07 * Math.sin(t * 0.0008 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${a})`;
        ctx.fill();
      });
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.07 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw(0);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ─── 3-D tilt card ─────────────────────────────────────── */
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: ((e.clientY - r.top) / r.height - 0.5) * -14 });
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHov(false); }}
      animate={{ rotateX: tilt.y, rotateY: tilt.x, scale: hov ? 1.025 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Hero Orb — UPDATED DESIGN ──────────────────────────────────── */
function HeroOrb() {
  const RINGS = [
    // Durations and directions synced to your original snippet
    { duration: 25, reverse: false, color: "rgba(168,85,247,0.15)", dash: false, dotColor: "#a855f7", offset: "0%" },
    { duration: 18, reverse: true,  color: "rgba(217,70,239,0.20)", dash: true,  dotColor: "#d946ef", offset: "4%" },
    { duration: 12, reverse: false, color: "rgba(168,85,247,0.30)", dash: false, dotColor: "#c084fc", offset: "8%" },
  ];

  return (
    <div className="relative flex items-center justify-center"
      style={{ width: "min(350px,80vw)", height: "min(350px,80vw)" }}>

      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle,rgba(139,92,246,0.2),transparent 70%)" }} />

      {/* Rotating rings - Radius updated to be tighter/larger */}
      {RINGS.map((ring, idx) => (
        <motion.div key={idx}
          animate={{ rotate: ring.reverse ? -360 : 360 }}
          transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{
            inset: ring.offset,
            border: `1px ${ring.dash ? "dashed" : "solid"} ${ring.color}`,
          }}>
          {/* Orbiting dot - Matches original glow/size */}
          <div className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              top: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              background: ring.dotColor,
              boxShadow: `0 0 12px ${ring.dotColor}`,
            }} />
        </motion.div>
      ))}

      {/* Center profile circle - Image size increased (inset reduced from 26% to 12%) */}
      <div className="absolute rounded-full overflow-hidden shadow-2xl"
        style={{
          inset: "12%",
          background: "linear-gradient(135deg,#9333ea,#db2777,#2563eb)",
          boxShadow: "0 0 50px rgba(168,85,247,0.4), inset 0 0 20px rgba(0,0,0,0.2)",
        }}>
        <img
          src="/images/profile/developer-pic-1.png"
          alt="Abrar Hossain Zahin"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            parent.style.display = "flex";
            parent.style.alignItems = "center";
            parent.style.justifyContent = "center";
            parent.innerHTML = '<span style="font-family:Syne,sans-serif;font-weight:900;color:white;font-size:2rem">AZ</span>';
          }}
        />
      </div>

      {/* Floating badges — Positioned closer to the larger orb boundaries */}
      {[
        { label: "5+ Papers",    icon: "🔬", style: { top: "1%",   right: "-5%"  } },
        { label: "10+ Projects", icon: "🚀", style: { bottom: "5%", left: "-10%"  } },
        { label: "EWU · CSE",   icon: "🎓", style: { bottom: "2%",  right: "-8%"  } },
      ].map((b, i) => (
        <motion.div key={b.label}
          animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }} // Alternating float from previous code
          transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bg-zinc-900/95 border border-zinc-700/50 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md z-20"
          style={b.style}>
          <p className="text-xs font-bold text-zinc-100 flex items-center gap-2 whitespace-nowrap">
            <span className="opacity-80">{b.icon}</span>{b.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Section heading ───────────────────────────────────── */
function SectionHead({ tag, title, gradient, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-purple-400/80 mb-3">{tag}</p>
      <h2 className="font-black leading-none"
        style={{ fontSize: "clamp(2rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
        {gradient
          ? <><span className="text-zinc-100">{title.split(" ").slice(0, -1).join(" ")} </span>
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>{title.split(" ").slice(-1)[0]}</span></>
          : <span className="text-zinc-100">{title}</span>
        }
      </h2>
    </div>
  );
}

/* ─── Bento project card ────────────────────────────────── */
function BentoCard({ project, variant = "normal", index = 0 }) {
  const isFeatured = variant === "featured";
  return (
    <TiltCard className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }}
        className="group relative h-full rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-purple-500/40 transition-colors duration-300 flex flex-col"
        style={{ background: "linear-gradient(145deg,#18181b,#09090b)" }}>

        <div className={`relative ${isFeatured ? "h-52" : "h-36"} bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
          <div className="absolute inset-0 opacity-[0.18]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <span className="absolute bottom-2 right-3 text-6xl font-black text-white/10 select-none leading-none"
            style={{ fontFamily: "'Syne',sans-serif" }}>{String(index + 1).padStart(2, "0")}</span>
          <span className="relative select-none group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
            style={{ fontSize: isFeatured ? "72px" : "52px" }}>{project.emoji}</span>
          {project.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-white/80 uppercase tracking-widest">Featured</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-black text-zinc-100 leading-snug mb-2 group-hover:text-purple-200 transition-colors duration-200"
            style={{ fontFamily: "'Syne',sans-serif", fontSize: isFeatured ? "1.1rem" : "0.95rem" }}>
            {project.title}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, isFeatured ? 4 : 2).map(t => (
              <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 border border-zinc-700/50">{t}</span>
            ))}
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 hover:text-purple-400 transition-colors group/lnk">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span className="group-hover/lnk:translate-x-0.5 transition-transform">GitHub →</span>
          </a>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─── Tool promo card ───────────────────────────────────── */
function ToolCard({ icon, label, tag, desc, href, gradient, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      className="group relative">
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
        style={{ background: gradient }} />
      <Link href={href}
        className="relative flex flex-col gap-4 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/70 hover:bg-zinc-900 transition-all duration-300 h-full">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg"
            style={{ background: gradient }}>{icon}</div>
          <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-1 rounded-full">{tag}</span>
        </div>
        <div>
          <h4 className="font-black text-zinc-100 text-sm mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>{label}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
        </div>
        <p className="text-xs font-mono text-purple-400 group-hover:text-purple-300 mt-auto">Open tool →</p>
      </Link>
    </motion.div>
  );
}

/* ─── Skill marquee ─────────────────────────────────────── */
const SKILLS = ["Python","TensorFlow","PyTorch","Pandas","OpenCV", "Postman", "JUnit", "Selenium", "JMeter", "pytest", "Cypress", "TestNG","Scikit-learn","TypeScript","React","Next.js","Tailwind","Docker","Git","Jupyter","HuggingFace","NumPy","Matplotlib","YOLO","Transformers"];

/* ─── GitHub Home Widget ────────────────────────────────── */
function GitHubHomeWidget() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const LANG_COLORS = {
    Python:"#3572A5",TypeScript:"#3178c6",JavaScript:"#f1e05a",
    HTML:"#e34c26",CSS:"#563d7c","C++":"#f34b7d",C:"#555555",
    Java:"#b07219",Shell:"#89e051",Jupyter:"#DA5B0B",
  };
  const lc = (l) => LANG_COLORS[l] || "#8b8fa8";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {loading
            ? Array(4).fill(0).map((_,i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
              ))
            : [
                { label:"Repos",     val: data?.profile?.publicRepos ?? "—", color:"text-purple-400" },
                { label:"Stars",     val: data?.stats?.totalStars    ?? "—", color:"text-amber-400"  },
                { label:"Followers", val: data?.profile?.followers   ?? "—", color:"text-blue-400"   },
                { label:"Forks",     val: data?.stats?.totalForks    ?? "—", color:"text-emerald-400"},
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center bg-zinc-900/70 border border-zinc-800/60 rounded-xl px-4 py-3">
                  <span className={`text-xl font-black ${s.color}`} style={{ fontFamily:"'Syne',sans-serif" }}>{s.val}</span>
                  <span className="text-[10px] font-mono text-zinc-600 mt-0.5 uppercase tracking-widest">{s.label}</span>
                </div>
              ))
          }
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Contribution Activity · Last 12 months
          </p>
          <div className="overflow-x-auto">
            <img src="https://ghchart.rshah.org/c9a84c/Zahin2470" alt="GitHub contribution graph"
              className="w-full h-auto rounded-lg min-w-[500px]"
              style={{ filter:"brightness(0.95) saturate(1.1)" }} loading="lazy" />
          </div>
        </div>

        {!loading && data?.topLanguages?.length > 0 && (
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Top Languages</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-px mb-3">
              {data.topLanguages.map(l => (
                <div key={l.name} style={{ width:`${l.pct}%`, background:lc(l.name) }}
                  className="rounded-sm" title={`${l.name} ${l.pct}%`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {data.topLanguages.map(l => (
                <span key={l.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full" style={{ background:lc(l.name) }} />
                  {l.name}<span className="text-zinc-600 text-[10px] ml-1">{l.pct}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Top Repositories</p>
        {loading
          ? Array(4).fill(0).map((_,i) => (
              <div key={i} className="h-24 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
            ))
          : data?.topRepos?.slice(0,4).map((repo,i) => (
              <motion.a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity:0, x:16 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.07 }}
                whileHover={{ x:4 }}
                className="group flex flex-col gap-1.5 p-3.5 bg-zinc-900/60 border border-zinc-800/60
                           hover:border-amber-500/30 rounded-xl transition-all duration-200 block">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors truncate">
                    {repo.name}
                  </span>
                  <span className="text-amber-500/50 group-hover:text-amber-400 text-xs shrink-0">↗</span>
                </div>
                {repo.description && (
                  <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed">{repo.description}</p>
                )}
                <div className="flex items-center gap-3 mt-0.5">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
                      <span className="w-2 h-2 rounded-full" style={{ background:lc(repo.language) }} />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="text-[10px] font-mono text-zinc-700">⭐ {repo.stars}</span>
                  )}
                </div>
              </motion.a>
            ))
        }
        <Link href="/about"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-800
                     hover:border-amber-500/40 text-xs font-mono text-zinc-600 hover:text-amber-400 transition-all duration-200">
          Full Dashboard on About page →
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 700], [0, 100]);
  const heroFade     = useTransform(scrollY, [0, 420], [1, 0]);

  const [c1, r1] = useCounter(projects.length);
  const [c2, r2] = useCounter(researchPapers.length);
  const [c3, r3] = useCounter(3);

  const TYPED_WORDS = ["AI & ML Engineer","Software Quality Tester","Deep Learning Researcher","Computer Vision Builder","NLP Practitioner","Green AI Advocate"];

  const TOOLS = [
    { icon:"🤖", label:"AI Assistant",     tag:"Live AI",   desc:"Ask anything about Zahin's research, projects, and background.",     href:"/chat",             gradient:"linear-gradient(135deg,#7c3aed,#4f46e5)" },
    { icon:"📄", label:"Paper Summarizer", tag:"Free Tool", desc:"Paste any abstract — get plain-English breakdown instantly.",         href:"/paper-summarizer", gradient:"linear-gradient(135deg,#9333ea,#db2777)" },
    { icon:"💡", label:"Research Ideas",   tag:"Free Tool", desc:"Enter a topic → 5 novel research directions with full methodology.",   href:"/research-ideas",   gradient:"linear-gradient(135deg,#2563eb,#0891b2)" },
    { icon:"📋", label:"Resume Builder",   tag:"Free Tool", desc:"3 templates, 5 color themes, live preview, one-click PDF export.",     href:"/resume-builder",   gradient:"linear-gradient(135deg,#059669,#0d9488)" },
  ];

  const SOCIAL_LINKS = [
    { label:"Facebook",     href:"https://facebook.com/AbrarHossainZahin" },
    { label:"Scholar",      href:"https://scholar.google.com/citations?user=PggflFIAAAAJ" },
    { label:"LinkedIn",     href:"https://linkedin.com/in/md-abrar-hossain-zahin" },
    { label:"Kaggle",       href:"https://kaggle.com/mdabrarhossainzahin" },
    { label:"LeetCode",     href:"https://leetcode.com/u/MdZahin" },
    { label:"ResearchGate", href:"https://www.researchgate.net/profile/Abrar-Zahin-7" },
    { label:"YouTube",      href:"https://www.youtube.com/@Abrar_Hossain_Zahin" },
  ];

  return (
    <div className="text-white" style={{ overflowX:"hidden", background:"transparent" }}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center" style={{ overflow:"hidden", background:"transparent" }}>
        <NeuralCanvas />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
            style={{ background:"radial-gradient(circle,#7c3aed,transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background:"radial-gradient(circle,#2563eb,transparent 70%)" }} />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundImage:"linear-gradient(rgba(168,85,247,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.04) 1px,transparent 1px)", backgroundSize:"72px 72px" }} />

        <motion.div style={{ y:heroParallax, opacity:heroFade }}
          className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 pt-28 pb-20">
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center gap-10">

            {/* Orb — first on mobile */}
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.15, duration:1.1, ease:[0.22,1,0.36,1] }}
              className="order-1 lg:order-2 flex justify-center w-full">
              <HeroOrb />
            </motion.div>

            {/* Text — second on mobile */}
            <div className="order-2 lg:order-1 text-center lg:text-left">

              <motion.div 
                initial={{ opacity:0, y:-12 }} 
                animate={{ opacity:1, y:0 }} 
                transition={{ delay:0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-mono text-emerald-400 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to Research Collaborations &amp; Internships
              </motion.div>

              {/* Updated Name Section — Matching your specific responsive pattern */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-black leading-none mb-4 break-words 
                          text-[1.65rem] 
                          xs:text-[1.85rem] 
                          sm:text-[2.05rem] 
                          md:text-[2.25rem] 
                          lg:text-[2.55rem] 
                          tracking-[-0.03em]"
                style={{ 
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.03em"
                }}
              >
                <div className="whitespace-nowrap">
                  <span className="text-white">Abrar </span>
                  <span className="text-white">Hossain </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">Zahin</span>
                </div>
              </motion.h1>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                className="text-sm sm:text-base font-mono mb-5 min-h-[1.4rem]">
                <TypedText words={TYPED_WORDS} />
              </motion.div>

              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
                className="text-zinc-400 leading-relaxed max-w-lg mb-8 text-center lg:text-left"
                style={{ fontSize:"0.97rem" }}>
                B.Sc. in CSE at{" "}
                <span className="text-purple-300 font-medium">East West University, Dhaka, Bangladesh</span>
                {" "}- building intelligent systems for Healthcare, Environment &amp; Education
                using ML, DL, NLP &amp; Computer Vision.
              </motion.p>

              {/* ─── FIXED: uses s.label and s.href, not s.l / s.h ─── */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                className="flex gap-5 flex-wrap justify-center lg:justify-start">
                {SOCIAL_LINKS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-zinc-500 hover:text-purple-400 transition-colors font-mono">
                    {s.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[9px] text-zinc-700 font-mono tracking-widest uppercase">scroll</span>
          <motion.div animate={{ y:[0,9,0] }} transition={{ duration:1.6, repeat:Infinity }}
            className="w-px h-10 bg-gradient-to-b from-purple-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════ */}
      <div className="relative border-y border-zinc-800/60">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-purple-950/20 to-zinc-950" />
        <div className="relative max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { ref:r1, num:c1, sfx:"+", label:"Projects Built",    grad:"from-purple-400 to-fuchsia-400" },
            { ref:r2, num:c2, sfx:"+", label:"Research Papers",   grad:"from-blue-400 to-cyan-400" },
            { ref:r3, num:c3, sfx:"+", label:"Years Coding",      grad:"from-emerald-400 to-teal-400" },
            { ref:null, num:null, sfx:"∞", label:"Problems to Solve", grad:"from-amber-400 to-orange-400" },
          ].map((s, i) => (
            <div key={i} ref={s.ref} className="text-center group cursor-default">
              <p className={`font-black mb-0.5 bg-gradient-to-r ${s.grad} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                style={{ fontSize:"clamp(2rem,3vw,2.5rem)", fontFamily:"'Syne',sans-serif" }}>
                {s.num !== null ? s.num : ""}{s.sfx}
              </p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SKILLS MARQUEE ═══════════════════════════════ */}
      <section className="py-10 border-b border-zinc-800/40" style={{ overflow:"hidden" }}>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background:"linear-gradient(to right,#09090b,transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
            style={{ background:"linear-gradient(to left,#09090b,transparent)" }} />
          <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:35, repeat:Infinity, ease:"linear" }}
            className="flex gap-3 whitespace-nowrap">
            {[...SKILLS,...SKILLS].map((sk, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500 font-mono shrink-0 hover:border-purple-500/40 hover:text-purple-300 transition-all cursor-default">
                <span className="w-1 h-1 rounded-full bg-purple-500/50" />{sk}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ PROJECTS — BENTO GRID ════════════════════════ */}
      <section className="py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <SectionHead title="What I've Built" gradient="linear-gradient(135deg,#a855f7,#6366f1)" />
            <Link href="/projects" className="hidden md:flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-purple-400 transition-colors">
              all projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0,2).map((p,i) => (
              <div key={p.id} className="lg:col-span-1">
                <BentoCard project={p} variant="featured" index={i} />
              </div>
            ))}
            {projects.slice(2).map((p,i) => (
              <BentoCard key={p.id} project={p} variant="normal" index={i+2} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/projects" className="text-xs font-mono text-purple-400 hover:text-purple-300">View all projects →</Link>
          </div>
        </div>
      </section>

      {/* ══ RESEARCH ══════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <SectionHead title="Publications" gradient="linear-gradient(135deg,#818cf8,#38bdf8)" />
            <Link href="/research" className="hidden md:flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-indigo-400 transition-colors">
              all papers →
            </Link>
          </div>
          <div className="space-y-3 mb-10">
            {researchPapers.map((paper, i) => (
              <motion.div key={paper.id}
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.06 }}
                className="group relative flex items-start gap-5 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 cursor-default">
                <span className="shrink-0 text-xs font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors w-5 pt-0.5">
                  {String(i+1).padStart(2,"0")}
                </span>
                <div className={`shrink-0 w-9 h-9 bg-gradient-to-br ${paper.iconGradient} rounded-xl flex items-center justify-center text-base shadow-lg`}>
                  {paper.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-zinc-600 mb-1">{paper.tags?.[0] ?? "Research"}</p>
                  <h3 className="text-sm font-semibold text-zinc-200 leading-snug group-hover:text-white transition-colors">{paper.title}</h3>
                </div>
                <div className="shrink-0 text-zinc-800 group-hover:text-purple-400 transition-all duration-200 group-hover:translate-x-1">→</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm border border-zinc-700 hover:border-indigo-500/50 hover:bg-indigo-500/8 text-zinc-400 hover:text-indigo-300 transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
              </svg>
              View All on Google Scholar →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RESUME BUILDER PROMO
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-5 sm:px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

            {/* Glowing card */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Gradient border glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-600/40 via-purple-600/20 to-blue-600/40 blur-sm" />

              <div className="relative bg-zinc-900/90 border border-zinc-700/60 rounded-2xl p-8 sm:p-12">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative grid md:grid-cols-2 gap-10 items-center">
                  {/* Left: text */}
                  <div>
                    <h2 className="font-black leading-none mb-4"
                      style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                      <span className="text-white">Build your </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Resume</span>
                      <br />
                      <span className="text-white">in minutes</span>
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-7 max-w-md">
                      A free resume builder built into this portfolio. Fill in your details across 7 sections, see a live preview, and download a clean PDF — no account needed, no data stored.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {[
                        { icon: "⚡", label: "Live Preview" },
                        { icon: "📄", label: "PDF Download" },
                        { icon: "🔒", label: "No Sign-up" },
                        { icon: "🎨", label: "Clean Format" },
                        { icon: "📱", label: "Mobile Friendly" },
                      ].map((f) => (
                        <span key={f.label}
                          className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400">
                          <span>{f.icon}</span>{f.label}
                        </span>
                      ))}
                    </div>

                    <Link href="/resume-builder"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Open Resume Builder →
                    </Link>
                  </div>

                  {/* Right: mini resume mockup */}
                  <div className="hidden md:block">
                    <div className="bg-white rounded-xl shadow-2xl p-5 text-zinc-900 rotate-1 hover:rotate-0 transition-transform duration-300"
                      style={{ fontSize: "8px", lineHeight: "1.4", fontFamily: "Arial, sans-serif" }}>
                      {/* Mock header */}
                      <div style={{ borderBottom: "1.5px solid #18181b", paddingBottom: "8px", marginBottom: "8px" }}>
                        <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.02em" }}>Your Name</div>
                        <div style={{ color: "#7c3aed", fontWeight: "600", fontSize: "9px", marginBottom: "4px" }}>AI &amp; ML Engineer</div>
                        <div style={{ display: "flex", gap: "10px", color: "#71717a", fontSize: "7px" }}>
                          <span>✉ you@email.com</span>
                          <span>⌖ Your City</span>
                          <span>in linkedin.com/in/you</span>
                        </div>
                      </div>
                      {/* Mock sections */}
                      {[
                        { title: "PROFESSIONAL SUMMARY", lines: ["Passionate engineer with expertise in machine", "learning, deep learning and computer vision..."] },
                        { title: "EDUCATION", lines: ["B.Sc. Computer Science · Your University · 2022–Present", "GPA: 3.7 · Focus: ML, DL, NLP"] },
                        { title: "SKILLS", lines: ["AI / ML: Python, TensorFlow, PyTorch, Scikit-learn", "Web: React, Next.js, TypeScript, Tailwind CSS"] },
                        { title: "PROJECTS", lines: ["Project Name — Tech Stack", "Brief description of what it does and what you built..."] },
                      ].map((sec) => (
                        <div key={sec.title} style={{ marginBottom: "8px" }}>
                          <div style={{ fontSize: "7px", fontWeight: "700", letterSpacing: "0.08em", borderBottom: "0.5px solid #e4e4e7", paddingBottom: "2px", marginBottom: "4px", color: "#18181b" }}>
                            {sec.title}
                          </div>
                          {sec.lines.map((l, i) => (
                            <div key={i} style={{ color: "#52525b", marginBottom: "1px" }}>{l}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          AI TOOLS PROMO — Summarizer + Idea Generator
      ═══════════════════════════════════════════════════ */}
      <section className="py-8 px-5 sm:px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid md:grid-cols-2 gap-5">

              {/* Paper Summarizer card */}
              <div className="relative rounded-2xl overflow-hidden group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/30 to-fuchsia-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-7 transition-colors h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-2xl shadow-lg shrink-0">📄</div>
                    <div>
                      <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-1">Free Tool</p>
                      <h3 className="font-black text-lg text-white" style={{ fontFamily: "'Syne',sans-serif" }}>Paper Summarizer</h3>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 flex-1">
                    Paste any research paper abstract or title. The AI breaks it into plain English — problem, method, findings, key terms, and why it matters. Perfect for quickly understanding papers outside your area.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {["Plain English", "Key Terms", "TL;DR", "Instant"].map(f => (
                      <span key={f} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">{f}</span>
                    ))}
                  </div>
                  <Link href="/paper-summarizer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 w-fit">
                    Try Summarizer →
                  </Link>
                </div>
              </div>

              {/* Research Idea Generator card */}
              <div className="relative rounded-2xl overflow-hidden group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-7 transition-colors h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl shadow-lg shrink-0">💡</div>
                    <div>
                      <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-1">Free Tool</p>
                      <h3 className="font-black text-lg text-white" style={{ fontFamily: "'Syne',sans-serif" }}>Research Idea Generator</h3>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 flex-1">
                    Enter any research topic - Medical Imaging, Cybersecurity, Green AI, NLP - and get 5 novel, publishable research directions with full methodology, novelty factor, and expected outcomes.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {["5 Novel Ideas", "Methodology", "12 Topic Presets", "Expandable"].map(f => (
                      <span key={f} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">{f}</span>
                    ))}
                  </div>
                  <Link href="/research-ideas"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-bold text-sm transition-all duration-200 w-fit">
                    Generate Ideas →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          AI CHAT PROMO
      ═══════════════════════════════════════════════════ */}
      <section className="py-8 px-5 sm:px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-fuchsia-600/30 blur-sm" />
              <div className="relative bg-zinc-900/90 border border-zinc-700/60 rounded-2xl p-8 sm:p-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  {/* Left */}
                  <div>
                    <h2 className="font-black leading-tight mb-3"
                      style={{ fontSize: "clamp(1.5rem,2vw,1.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                      <span className="text-white">Have questions? </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ask my AI</span>
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-md">
                      An AI assistant trained on my entire portfolio. Ask it anything, research papers, projects, tech stack, collaboration opportunities, or how to reach me.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono text-zinc-500">
                      {[
                        "What's his strongest skill?",
                        "Is he open to internships?",
                        "Tell me about TumorXAI",
                      ].map((q) => (
                        <span key={q} className="px-2.5 py-1 bg-zinc-800/80 border border-zinc-700 rounded-lg">&quot;{q}&quot;</span>
                      ))}
                    </div>
                    <Link href="/chat"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      Start Chatting →
                    </Link>
                  </div>

                  {/* Right: chat mockup */}
                  <div className="hidden md:flex flex-col gap-2.5 p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl font-mono">
                    {[
                      { role: "user",      text: "What research has Zahin published?" },
                      { role: "assistant", text: "He has 6 research papers spanning Medical AI, Green Computing, XAI and Post-Quantum Cryptography. His most notable is TumorXAI — an explainable brain MRI classifier..." },
                      { role: "user",      text: "Is he open to collaborations?" },
                      { role: "assistant", text: "Yes! Zahin is actively looking for research collaborations and internship opportunities in AI/ML. You can reach him via the Connect page." },
                    ].map((m, i) => (
                      <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${
                          m.role === "user"
                            ? "bg-purple-600/80 text-white rounded-br-sm"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-bl-sm"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-600">Ask anything...</div>
                      <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs">↑</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ GITHUB STATS ══════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHead title="Code Activity" gradient="linear-gradient(135deg,#c9a84c,#f59e0b)" />
            <a href="https://github.com/Zahin2470" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-amber-400 transition-colors border border-zinc-800 hover:border-amber-500/40 px-3 py-1.5 rounded-lg">
              @Zahin2470 →
            </a>
          </div>
          <GitHubHomeWidget />
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section className="relative py-32 px-5 sm:px-6 overflow-hidden border-t border-zinc-800/50">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
            style={{ background:"radial-gradient(circle,#7c3aed,transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-[10px] font-mono tracking-[0.25em] text-purple-400/80 uppercase mb-6">Let&apos;s Build Something</p>
            <h2 className="font-black leading-[0.95] mb-6"
              style={{ fontSize:"clamp(2.5rem,3vw,2rem)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.04em" }}>
              <span className="block text-zinc-100">Open to Research</span>
              <span className="block text-transparent bg-clip-text"
                style={{ backgroundImage:"linear-gradient(135deg,#a855f7,#ec4899,#6366f1)" }}>
                &amp; Opportunities
              </span>
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-10 text-sm sm:text-base max-w-lg mx-auto">
              ML projects, research collaborations, AI discussions - if it involves building something intelligent, I&apos;m interested.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/connect"
                className="relative px-9 py-4 rounded-xl font-black text-sm overflow-hidden group shadow-2xl shadow-purple-900/30"
                style={{ background:"linear-gradient(135deg,#7c3aed,#db2777,#4f46e5)" }}>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:"linear-gradient(135deg,#9333ea,#ec4899,#6366f1)" }} />
                <span className="relative">Get in Touch ✉️</span>
              </Link>
              <Link href="/about"
                className="px-9 py-4 rounded-xl border border-zinc-700 hover:border-zinc-500 font-black text-sm text-zinc-400 hover:text-zinc-100 transition-all duration-200">
                More About Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
