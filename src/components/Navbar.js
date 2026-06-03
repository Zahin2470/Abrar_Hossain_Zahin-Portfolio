"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { useTheme } from "@/components/ThemeWrapper";
import VisitorCounter from "@/components/VisitorCounter";

/* ── Main nav links — same structure as before ─────────── */
const mainLinks = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/about" },
  { name: "Projects", href: "/projects",
    sub: [
      { name: "All Projects",   href: "/projects",       icon: "🚀", desc: "Full project showcase" },
      { name: "Data Visualizer",href: "/data-visualizer",icon: "📊", desc: "Upload CSV → instant charts" },
    ]
  },
  { name: "Research", href: "/research" },
  {
    name: "Resume Builder", href: "/resume-builder",
    sub: [
      { name: "Resume Builder", href: "/resume-builder",  icon: "📋", desc: "3 templates · 5 themes · PDF export" },
      { name: "Cover Page",     href: "/cover-page",      icon: "📝", desc: "EWU Assignment Cover Page" },
      { name: "GPA Calculator", href: "/gpa-calculator",  icon: "🎓", desc: "GPA · target grades · CGPA" },
    ]
  },
  { name: "AI ChatBot",          href: "/chat" },
  {
    name: "AI Paper Summarizer", href: "/paper-summarizer",
    sub: [
      { name: "Paper Summarizer", href: "/paper-summarizer", icon: "📄", desc: "Summarize any research paper" },
      { name: "Case Studies",     href: "/case-studies",      icon: "🔬", desc: "Interactive research deep-dives" },
    ]
  },
  { name: "AI Research Ideas", href: "/research-ideas" },
  { name: "Connect",           href: "/connect" },
];

/* ── Dropdown sub-menu ──────────────────────────────────── */
function SubMenu({ items, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{   opacity: 0, y: -8,  scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[220px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            zIndex: 100,
            background: "rgba(9,9,11,0.97)",
            border: "1px solid rgba(168,85,247,0.18)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="p-1.5">
            {items.map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                           text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100">
                <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{item.name}</p>
                  <p className="text-[11px] text-zinc-600 group-hover:text-zinc-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [hoveredPath, setHoveredPath] = useState(pathname);
  const [openSub,     setOpenSub]     = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => { setMobileOpen(false); setOpenSub(null); }, [pathname]);

  const handleMouseEnter = (href) => {
    clearTimeout(timeoutRef.current);
    setHoveredPath(href);
    setOpenSub(href);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenSub(null);
    }, 120);
  };

  const isActive = (link) =>
    pathname === link.href ||
    (link.sub && link.sub.some(s => pathname === s.href));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500">
      <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm shadow-black/5" />

      <nav className="relative max-w-[1440px] mx-auto px-8 py-3 flex justify-between items-center gap-8">

        {/* Logo — unchanged */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
          <Link href="/" className="group flex items-center gap-2">
            <span
              className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {siteConfig.shortName}
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav — same pill container, sub-menus added */}
        <div
          className="hidden xl:flex items-center gap-1 p-1 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/20 dark:border-zinc-800/50"
          onMouseLeave={() => { setHoveredPath(pathname); handleMouseLeave(); }}
        >
          {mainLinks.map((link) => {
            const active  = isActive(link);
            const hasSub  = link.sub?.length > 0;

            return (
              <div key={link.href} className="relative"
                onMouseEnter={() => handleMouseEnter(link.href)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1 px-4 py-2 text-base font-semibold transition-colors duration-300 rounded-xl whitespace-nowrap ${
                    active
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {/* Sliding background — same as before */}
                  {hoveredPath === link.href && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* Active dot — same as before */}
                  {active && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"
                    />
                  )}
                  {link.name}
                  {/* Tiny chevron on items with sub-menus */}
                  {hasSub && (
                    <motion.svg
                      animate={{ rotate: openSub === link.href ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-3 h-3 opacity-50"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  )}
                </Link>

                {/* Sub-menu dropdown */}
                {hasSub && (
                  <div onMouseEnter={() => clearTimeout(timeoutRef.current)}>
                    <SubMenu items={link.sub} visible={openSub === link.href} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Group — unchanged */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <VisitorCounter />
          </div>

          {/* Theme Toggle — unchanged */}
          <button
            onClick={toggle}
            className="group relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-purple-500/50"
            aria-label="Toggle theme"
          >
            <motion.div
              animate={{ y: dark ? -18 : 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </motion.div>
          </button>

          {/* Mobile Burger — unchanged */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-10 h-10 rounded-2xl bg-zinc-300 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.span animate={mobileOpen ? { rotate: 45,  y: 8  } : { rotate: 0,  y: 0 }} className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
            <motion.span animate={mobileOpen ? { opacity: 0           } : { opacity: 1     }} className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu — compact, all items + sub-items ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -20 }}
            className="xl:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 60px)" }}
          >
            {/* Visitor counter */}
            <div className="px-6 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <VisitorCounter />
            </div>

            <div className="flex flex-col px-6 py-3 gap-0">
              {mainLinks.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Parent link */}
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-2.5 text-base font-semibold tracking-tight
                                border-b border-zinc-100 dark:border-zinc-800/40 transition-colors ${
                      isActive(link)
                        ? "text-purple-500"
                        : "text-zinc-700 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400"
                    }`}
                  >
                    {link.name}
                    {isActive(link) && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />}
                  </Link>

                  {/* Sub-links indented */}
                  {link.sub?.length > 0 && (
                    <div className="pl-4 mb-1">
                      {link.sub.filter(s => s.href !== link.href).map(s => (
                        <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 py-1.5 text-sm transition-colors
                                      border-b border-zinc-100/60 dark:border-zinc-800/20 last:border-0 ${
                            pathname === s.href
                              ? "text-purple-400"
                              : "text-zinc-500 dark:text-zinc-500 hover:text-purple-400"
                          }`}
                        >
                          <span className="text-sm">{s.icon}</span>
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}