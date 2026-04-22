"use client";
import { motion } from "framer-motion";
import { siteConfig, education, socialLinks } from "@/lib/data";
import SkillRadar from "@/components/SkillRadar";
import KaggleBadge from "@/components/KaggleBadge";
import GitHubStats from "@/components/GitHubStats";

const icons = {
  github:      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  linkedin:    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  kaggle:      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336z"/></svg>,
  scholar:     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/></svg>,
  researchgate:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a12.16 12.16 0 00-.36 2.812c-.05 1.169-.06 2.197-.03 3.088.508-.26 1.04-.37 1.59-.37.973 0 1.747.38 2.322 1.14.574.762.86 1.8.86 3.116 0 1.185-.267 2.167-.803 2.944-.534.775-1.29 1.164-2.262 1.164-.81 0-1.497-.324-2.061-.972-.564-.649-.846-1.482-.846-2.5 0-.538.04-1.016.123-1.43-.356-.182-.772-.273-1.248-.273-.34 0-.602.054-.789.16v9.586h2.437V14.58c.537.598 1.255.896 2.152.896 1.225 0 2.277-.477 3.16-1.43.882-.952 1.324-2.175 1.324-3.668 0-1.565-.45-2.816-1.348-3.755-.898-.938-2.02-1.408-3.365-1.408-.607 0-1.17.105-1.695.314a3.79 3.79 0 00-.336-1.254c-.223-.435-.54-.8-.95-1.097-.41-.297-.89-.446-1.44-.446zM0 4.253v15.497h6.14v-1.988H2.298V4.253H0zm8.867 0v15.497h2.297V4.253H8.867z"/></svg>,
  leetcode:    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>,
  codeforces:  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z"/></svg>,
  youtube:     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,
  facebook:    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
};

/* ── Diagonal stripe background ────────────────────────── */
function StripeBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg,#a855f7 0,#a855f7 1px,transparent 0,transparent 50%)", backgroundSize: "24px 24px" }} />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-800/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-800/8 rounded-full blur-3xl" />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="relative text-white min-h-screen pt-24 pb-24 overflow-hidden" style={{ background: "transparent" }}>
      <StripeBg />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── HEADER ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="mb-16">
          <h1 className="font-black leading-none mb-5"
            style={{ fontSize: "clamp(3rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.04em" }}>
            <span className="block text-white">About</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400">
              Me
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed text-lg">{siteConfig.bio}</p>
        </motion.div>

        {/* ── TWO-COLUMN: info + education ────────────────── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">

          {/* Info cards grid */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>,
                  label: "University",
                  value: siteConfig.university,
                  accent: "from-purple-500 to-fuchsia-500",
                  bg: "bg-purple-500/10 border-purple-500/20 hover:border-purple-400/40",
                  text: "text-purple-300",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                  label: "Location",
                  value: siteConfig.location,
                  accent: "from-emerald-500 to-teal-500",
                  bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/40",
                  text: "text-emerald-300",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
                  label: "Focus Areas",
                  value: "ML · Deep Learning · NLP · Computer Vision · XAI",
                  accent: "from-amber-500 to-orange-500",
                  bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-400/40",
                  text: "text-amber-300",
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
                  label: "Email",
                  value: siteConfig.email,
                  link: `mailto:${siteConfig.email}`,
                  accent: "from-rose-500 to-pink-500",
                  bg: "bg-rose-500/10 border-rose-500/20 hover:border-rose-400/40",
                  text: "text-rose-300",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className={`group flex items-center gap-4 p-4 rounded-xl border ${item.bg} transition-all duration-200`}
                >
                  {/* Icon box */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} bg-opacity-20 flex items-center justify-center ${item.text}`}>
                    {item.icon}
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.link ? (
                      <a href={item.link} className={`text-sm font-semibold ${item.text} hover:underline underline-offset-2 truncate block`}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{item.value}</p>
                    )}
                  </div>
                  {/* Right accent line */}
                  <div className={`shrink-0 w-0.5 h-8 bg-gradient-to-b ${item.accent} rounded-full opacity-40 group-hover:opacity-80 transition-opacity`} />
                </motion.div>
              ))}
            </div>

            {/* Resume button */}
            <motion.a
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-zinc-700 hover:border-purple-500/60 bg-zinc-900/60 hover:bg-purple-500/10 text-sm font-mono text-zinc-400 hover:text-purple-400 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download Resume ↗
            </motion.a>
          </motion.div>

          {/* Education card */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
            {education.map((edu, i) => (
              <div key={i} className="relative mb-6">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/15 to-blue-600/10 blur-sm" />
                <div className="relative bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl shadow-lg shrink-0">
                      🎓
                    </div>
                    <div>
                      <span className="text-xs font-mono text-purple-400 tracking-widest uppercase">Bachelor&apos;s Degree</span>
                      <h3 className="text-base font-black text-white mt-0.5 leading-snug"
                        style={{ fontFamily: "'Syne',sans-serif" }}>
                        {edu.degree}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="text-zinc-600 font-mono text-xs">inst.</span>
                      <span>{edu.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 font-mono text-xs">period</span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                        {edu.period}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 mt-4 leading-relaxed border-t border-zinc-800 pt-4">{edu.description}</p>
                </div>
              </div>
            ))}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { num: "3+",  label: "Years Coding",   color: "from-purple-400 to-fuchsia-400" },
                { num: "10+",  label: "Projects",       color: "from-blue-400 to-cyan-400" },
                { num: "5+",  label: "Papers",         color: "from-emerald-400 to-teal-400" },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
                    style={{ fontFamily: "'Syne',sans-serif" }}>{s.num}</p>
                  <p className="text-[10px] font-mono text-zinc-600 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── SKILLS RADAR ────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <h2 className="font-black mb-10 text-white"
            style={{ fontSize: "clamp(2rem,2vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            Skills &amp; Technologies
          </h2>
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 blur-sm" />
            <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <SkillRadar />
            </div>
          </div>
        </motion.div>

        {/* ── GITHUB LIVE STATS ───────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <h2 className="font-black mb-8 text-white"
            style={{ fontSize: "clamp(2rem,2vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            GitHub Dashboard
          </h2>
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-zinc-800/40 to-purple-900/10 blur-sm" />
            <div className="relative bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <GitHubStats />
            </div>
          </div>
        </motion.div>

        {/* ── SOCIAL LINKS + KAGGLE BADGE ─────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-black mb-8 text-white"
            style={{ fontSize: "clamp(2rem,2vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            Social Profiles
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Social icon grid — takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {socialLinks.map((s, i) => (
                  <motion.a key={s.label}
                    href={s.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex flex-col items-center gap-2.5 py-5 px-3 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 rounded-2xl transition-all duration-200 text-center"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 group-hover:bg-purple-600/20 border border-zinc-700 group-hover:border-purple-500/40 flex items-center justify-center text-zinc-400 group-hover:text-purple-400 transition-all duration-200">
                      {icons[s.icon] ?? <span className="text-xs font-bold">{s.label[0]}</span>}
                    </div>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors leading-tight">
                      {s.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Kaggle live badge — 1 column */}
            <div>
              <KaggleBadge />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
