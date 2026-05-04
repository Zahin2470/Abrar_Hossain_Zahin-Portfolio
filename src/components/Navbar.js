"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { useTheme } from "@/components/ThemeWrapper";
import VisitorCounter from "@/components/VisitorCounter";

const mainLinks = [
  { name: "Home",               href: "/" },
  { name: "About",              href: "/about" },
  { name: "Projects",           href: "/projects" },
  { name: "Research",           href: "/research" },
  { name: "Resume Builder",     href: "/resume-builder" },
  { name: "AI ChatBot",         href: "/chat" },
  { name: "AI Paper Summarizer",href: "/paper-summarizer" },
  { name: "AI Research Ideas",  href: "/research-ideas" },
  { name: "Connect",            href: "/connect" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(pathname);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500">
      <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm shadow-black/5" />

      <nav className="relative max-w-[1440px] mx-auto px-8 py-3 flex justify-between items-center gap-8">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
          <Link href="/" className="group flex items-center gap-2">
            <span
              className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {siteConfig.shortName}
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div
          className="hidden xl:flex items-center gap-1 p-1 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/20 dark:border-zinc-800/50"
          onMouseLeave={() => setHoveredPath(pathname)}
        >
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredPath(link.href)}
                className={`relative px-4 py-2 text-base font-semibold transition-colors duration-300 rounded-xl whitespace-nowrap ${
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {hoveredPath === link.href && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <VisitorCounter />
          </div>

          {/* Theme Toggle */}
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

          {/* Mobile Burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-10 h-10 rounded-2xl bg-zinc-300 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}             className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu — FIXED: compact spacing so all 9 items fit ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 60px)" }}  /* never taller than viewport */
          >
            {/* VisitorCounter on mobile */}
            <div className="px-6 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <VisitorCounter />
            </div>

            <div className="flex flex-col px-8 py-3 gap-3">
              {mainLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-2.5 text-base font-semibold tracking-tight border-b border-zinc-100 dark:border-zinc-800/40 last:border-0 transition-colors ${
                      pathname === link.href
                        ? "text-purple-500"
                        : "text-zinc-700 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400"
                    }`}
                  >
                    {link.name}
                    {pathname === link.href && (
                      <span className="w-1.7 h-1.9 rounded-full bg-purple-500 shrink-0" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}