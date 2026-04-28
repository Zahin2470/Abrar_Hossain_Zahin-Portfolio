"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialLinks, siteConfig } from "@/lib/data";

/* ── Social icon map ────────────────────────────────────── */
const icons = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  kaggle: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336z" />
    </svg>
  ),
  scholar: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z" />
    </svg>
  ),
  researchgate: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a12.193 12.193 0 00-.368 3.197 12.334 12.334 0 00.368 3.243c.243.743.65 1.303 1.213 1.68.565.376 1.255.565 2.073.565.817 0 1.507-.19 2.072-.565.564-.377.972-.937 1.215-1.68a12.298 12.298 0 00.367-3.243 12.157 12.157 0 00-.367-3.197c-.243-.744-.651-1.303-1.215-1.68C21.093.19 20.403 0 19.586 0zm0 8.553c-.976 0-1.464-.985-1.464-2.956 0-1.974.488-2.96 1.464-2.96.974 0 1.462.986 1.462 2.96 0 1.97-.488 2.956-1.462 2.956zM0 .39v23.22h11.366v-2.39H2.39V2.78H11.366V.39z" />
    </svg>
  ),
  leetcode: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  ),
  codeforces: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

/* ── Platform card ──────────────────────────────────────── */
const PLATFORM_CONFIG = {
  GitHub:      { color: "#6e5494", bg: "rgba(110,84,148,0.12)", border: "rgba(98, 3, 240, 0.25)", glow: "rgba(110,84,148,0.15)" },
  LinkedIn:    { color: "#0077b5", bg: "rgba(0,119,181,0.10)",  border: "rgba(0,119,181,0.25)",  glow: "rgba(0,119,181,0.12)" },
  Kaggle:      { color: "#20beff", bg: "rgba(32,190,255,0.10)", border: "rgba(32,190,255,0.25)", glow: "rgba(32,190,255,0.12)" },
  Scholar:     { color: "#4285f4", bg: "rgba(66,133,244,0.10)", border: "rgba(66,133,244,0.25)", glow: "rgba(66,133,244,0.12)" },
  ResearchGate:{ color: "#00d0af", bg: "rgba(0,208,175,0.10)",  border: "rgba(0,208,175,0.25)",  glow: "rgba(0,208,175,0.12)" },
  LeetCode:    { color: "#ffa116", bg: "rgba(255,161,22,0.10)", border: "rgba(255,161,22,0.25)", glow: "rgba(255,161,22,0.12)" },
  CodeForces:  { color: "#1f8acb", bg: "rgba(31,138,203,0.10)", border: "rgba(174, 203, 31, 0.25)", glow: "rgba(31,138,203,0.12)" },
  YouTube:     { color: "#ff0000", bg: "rgba(255,0,0,0.10)",    border: "rgba(255,0,0,0.22)",    glow: "rgba(255,0,0,0.10)"   },
};

function SocialCard({ link, index }) {
  const cfg = PLATFORM_CONFIG[link.label] || { color:"#a855f7", bg:"rgba(168,85,247,0.10)", border:"rgba(168,85,247,0.25)", glow:"rgba(168,85,247,0.12)" };
  const iconKey = link.icon?.toLowerCase() || link.label.toLowerCase().replace(/\s/g,"");

  return (
    <motion.a
      href={link.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all duration-300"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        boxShadow: `0 0 0 0 ${cfg.glow}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 24px 4px ${cfg.glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 0 ${cfg.glow}`; }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
        {icons[iconKey] ?? <span className="text-lg font-bold">{link.label[0]}</span>}
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{link.label}</p>

      {/* Handle */}
      {link.handle && (
        <p className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors truncate max-w-full px-2 text-center">
          {link.handle}
        </p>
      )}

      {/* Arrow */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: cfg.color }}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </motion.a>
  );
}

/* ── Contact form ───────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Hi Zahin,\n\nMy name is ${form.name}.\n\n${form.message}\n\nBest regards,\n${form.name}\n${form.email}`
    );
    const subject = encodeURIComponent(form.subject || `Portfolio Contact from ${form.name}`);
    window.open(`mailto:${siteConfig.email}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputCls = "w-full bg-zinc-900/80 border border-zinc-600/80 focus:border-purple-500/60 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Name *</label>
          <input required value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="Your full name" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Email *</label>
          <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
            placeholder="you@email.com" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Subject</label>
        <input value={form.subject} onChange={e => set("subject", e.target.value)}
          placeholder="Research collaboration, Internship opportunity, General inquiry..." className={inputCls} />
      </div>

      <div>
        <label className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Message *</label>
        <textarea required rows={3} value={form.message} onChange={e => set("message", e.target.value)}
          placeholder="Tell me about your project, research idea, or how we can collaborate..."
          className={`${inputCls} resize-none`} />
      </div>

      <button type="submit"
        className="group relative w-full py-3.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-200 shadow-lg shadow-purple-900/20"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(135deg, #9333ea, #6366f1)" }} />
        <span className="relative flex items-center justify-center gap-2">
          {sent ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mail client opened!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Message
            </>
          )}
        </span>
      </button>

      <p className="text-[10px] font-mono text-zinc-700 text-center">
        Opens your mail client · No data stored
      </p>
    </form>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function Connect() {
  return (
    <div className="relative text-white min-h-screen pt-24 pb-20"
      style={{ background: "transparent", overflowX: "hidden" }}>

      {/* Ambient glows — sit on top of StarCanvas without blocking it */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #2563eb, transparent 70%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6" style={{ zIndex: 3 }}>

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="font-black leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem,3vw,2rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
            <span className="text-white">Let&apos;s </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
              Collaborate
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Open to research collaborations, internship opportunities, AI/ML discussions,
            and any project that involves building something intelligent.
          </p>

          {/* Status badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { dot: "bg-emerald-400", text: "Open to Internships", border: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
              { dot: "bg-blue-400",    text: "Research Collaborations", border: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
              { dot: "bg-purple-400",  text: "AI/ML Projects", border: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
            ].map(b => (
              <div key={b.text} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${b.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${b.dot} animate-pulse`} />
                {b.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Main 2-col grid ────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">

          {/* Left — Contact form */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/15 to-blue-600/10 blur-sm" />
              <div className="relative bg-zinc-900/70 border border-purple-600/60 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Direct Message</p>
                    <p className="text-sm font-semibold text-zinc-100">Send a message</p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </motion.div>

          {/* Right — Info cards */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }} className="space-y-4">

            {/* Direct email card */}
            <div className="bg-zinc-900/70 border border-purple-600/60 rounded-2xl p-5">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Direct Email</p>
              <a href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/25 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-purple-300 font-mono transition-colors">
                  {siteConfig.email}
                </span>
              </a>
            </div>

            {/* Response time card */}
            <div className="bg-zinc-900/70 border border-purple-500/60 rounded-3xl p-5">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Response Time</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Within 24–48 Hours</p>
                  <p className="text-xs text-zinc-600 font-mono">Usually Much Faster</p>
                </div>
              </div>
            </div>

            {/* Open to card */}
            <div className="bg-zinc-900/70 border border-purple-500/60 rounded-3xl p-5">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Open To</p>
              <div className="space-y-2.5">
                {[
                  { icon: "🔬", text: "Joint Research Papers & Publications" },
                  { icon: "💼", text: "AI/ML Internship Opportunities" },
                  { icon: "🤝", text: "Open-Source Project Collaboration" },
                  { icon: "🎤", text: "Tech Talks & Conference Presentations" },
                  { icon: "📚", text: "Thesis Partnerships & Mentorship" },
                  { icon: "🛠️", text: "Software Quality and Assurence Testing" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs text-zinc-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Social platforms grid ───────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-black text-white"
                style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                Social Profiles
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {(socialLinks || [
              { label:"GitHub",       icon:"github",      url:"https://github.com/Zahin2470",                              handle:"@Zahin2470" },
              { label:"LinkedIn",     icon:"linkedin",    url:"https://linkedin.com/in/md-abrar-hossain-zahin",            handle:"md-abrar-hossain-zahin" },
              { label:"Kaggle",       icon:"kaggle",      url:"https://kaggle.com/mdabrarhossainzahin",                    handle:"@mdabrarhossainzahin" },
              { label:"Scholar",      icon:"scholar",     url:"https://scholar.google.com/citations?user=PggflFIAAAAJ",    handle:"Google Scholar" },
              { label:"ResearchGate", icon:"researchgate",url:"https://researchgate.net/profile/Abrar-Zahin-7",            handle:"Abrar-Zahin-7" },
              { label:"LeetCode",     icon:"leetcode",    url:"https://leetcode.com/u/MdZahin",                            handle:"@MdZahin" },
              { label:"CodeForces",   icon:"codeforces",  url:"https://codeforces.com/profile/MD.Zahin",                   handle:"MD.Zahin" },
              { label:"YouTube",      icon:"youtube",     url:"https://youtube.com/@Abrar_Hossain_Zahin",                  handle:"@Abrar_Hossain_Zahin" },
            ]).map((link, i) => (
              <SocialCard key={link.label} link={link} index={i} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
