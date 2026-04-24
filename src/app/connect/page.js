"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialLinks, siteConfig } from "@/lib/data";

/* ── Social icon SVGs ───────────────────────────────────── */
const icons = {
  github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  kaggle: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336z"/></svg>,
  scholar: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/></svg>,
  researchgate: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a12.16 12.16 0 00-.36 2.812c-.05 1.169-.06 2.197-.03 3.088.508-.26 1.04-.37 1.59-.37.973 0 1.747.38 2.322 1.14.574.762.86 1.8.86 3.116 0 1.185-.267 2.167-.803 2.944-.534.775-1.29 1.164-2.262 1.164-.81 0-1.497-.324-2.061-.972-.564-.649-.846-1.482-.846-2.5 0-.538.04-1.016.123-1.43-.356-.182-.772-.273-1.248-.273-.34 0-.602.054-.789.16v9.586h2.437V14.58c.537.598 1.255.896 2.152.896 1.225 0 2.277-.477 3.16-1.43.882-.952 1.324-2.175 1.324-3.668 0-1.565-.45-2.816-1.348-3.755-.898-.938-2.02-1.408-3.365-1.408-.607 0-1.17.105-1.695.314a3.79 3.79 0 00-.336-1.254c-.223-.435-.54-.8-.95-1.097-.41-.297-.89-.446-1.44-.446zM0 4.253v15.497h6.14v-1.988H2.298V4.253H0zm8.867 0v15.497h2.297V4.253H8.867z"/></svg>,
  leetcode: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>,
  codeforces: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z"/></svg>,
  youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,
  facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
};

const platformColors = {
  github:      { grad: "from-zinc-700 to-zinc-600",    accent: "#e2e8f0" },
  linkedin:    { grad: "from-blue-700 to-blue-600",    accent: "#93c5fd" },
  kaggle:      { grad: "from-cyan-700 to-cyan-600",    accent: "#67e8f9" },
  scholar:     { grad: "from-blue-800 to-indigo-700",  accent: "#a5b4fc" },
  researchgate:{ grad: "from-teal-700 to-teal-600",    accent: "#5eead4" },
  leetcode:    { grad: "from-amber-700 to-orange-600", accent: "#fcd34d" },
  codeforces:  { grad: "from-red-800 to-red-700",      accent: "#fca5a5" },
  youtube:     { grad: "from-red-700 to-rose-600",     accent: "#fca5a5" },
  facebook:    { grad: "from-blue-700 to-blue-500",    accent: "#93c5fd" },
};

/* ── Particle burst background ──────────────────────────── */
function ParticleBg() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p) => {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168,85,247,0.18)";
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach((b) => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(168,85,247,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

/* ── Social platform card ───────────────────────────────── */
function SocialCard({ link, index }) {
  const cfg = platformColors[link.icon] || { grad: "from-zinc-700 to-zinc-600", accent: "#e2e8f0" };
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 overflow-hidden"
    >
      {/* Background gradient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.grad} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      {/* Icon box */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.grad} flex items-center justify-center text-white shadow-lg`}>
        {icons[link.icon] ?? <span className="text-sm font-bold">{link.label[0]}</span>}
      </div>

      <div>
        <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{link.label}</p>
        <p className="text-xs font-mono text-zinc-600 truncate">{link.url.replace("https://", "")}</p>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-sm">
        ↗
      </div>
    </motion.a>
  );
}

/* ── Email form ─────────────────────────────────────────── */
function EmailForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    // Open Gmail compose window instead of default mail client
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}&su=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-zinc-500 mb-1.5 block">Your Name</label>
          <input
            required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Abrar Hossain Hossain"
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-500 mb-1.5 block">Your Mail</label>
          <input
            required type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors font-mono"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-mono text-zinc-500 mb-1.5 block">Write Message</label>
        <textarea
          required rows={5} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Hey Zahin, I'd love to collaborate on..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors font-mono resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full group relative py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.span key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-emerald-300">
              <span>✓</span> Opening your mail client…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2">
              Send via Gmail <span>📧</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Connect() {
  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-24 pb-24 overflow-hidden">
      <ParticleBg />

      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mb-16">
          <h1 className="font-black leading-none mb-5"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em" }}>
            <span className="text-white">Let&apos;s Build </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Something Great</span>  
          </h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            Open to research collaborations, ML projects, and conversations about AI. Pick any platform below or drop a message directly.
          </p>
        </motion.div>

        {/* ── Main grid: form + socials ──────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">

          {/* LEFT: contact form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 blur-sm" />
              <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Get in Touch
                </h2>
                <EmailForm />
              </div>
            </div>

            {/* Info cards below form */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: "Location",  val: "Dhaka, Bangladesh", icon: "📍" },
                { label: "Status",    val: "Open to collaborate", icon: "🟢" },
                { label: "Response",  val: "Within 24 hours", icon: "⚡" },
                { label: "Focus",     val: "AI/ML Research", icon: "🔬" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                  <p className="text-base mb-1">{item.icon}</p>
                  <p className="text-xs font-mono text-zinc-600 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-zinc-300">{item.val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: social platform grid */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4">Social Platforms</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {socialLinks.map((link, i) => (
                <SocialCard key={link.label} link={link} index={i} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA banner ─────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-600/30 via-fuchsia-600/20 to-blue-600/30 blur-sm" />
          <div className="relative bg-zinc-900/80 border border-zinc-700/60 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-2xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Always excited about new <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ideas</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Whether it&apos;s a ground-breaking ML paper, a side project, or just a chat about the future of AI, my inbox is always open.
            </p>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Gmail Me <span>📧</span>
              <span>→</span>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
