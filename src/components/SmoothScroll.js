"use client";
import { useEffect } from "react";

/**
 * SmoothScroll — Lenis smooth scroll integration
 *
 * FIRST run in your project:
 *   npm install lenis
 *
 * Then add <SmoothScroll /> inside ThemeWrapper.js (see below).
 *
 * ─── ThemeWrapper.js usage ────────────────────────────────
 *   import SmoothScroll from "@/components/SmoothScroll";
 *
 *   export default function ThemeWrapper({ children }) {
 *     return (
 *       <ThemeContext.Provider ...>
 *         <SmoothScroll />          ← add this line
 *         <StarCanvas />
 *         ...
 *       </ThemeContext.Provider>
 *     );
 *   }
 * ─────────────────────────────────────────────────────────
 *
 * This component renders nothing visible — it just attaches
 * Lenis to the window and keeps it in sync with RAF.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis;
    let rafId;

    // Dynamic import so it never runs on server
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration:   1.3,          // scroll animation length in seconds
        easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
        smoothWheel: true,
        touchMultiplier: 2.0,
        infinite:   false,
      });

      // Sync with requestAnimationFrame
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // Make lenis available globally so other components
      // can call lenis.scrollTo() for smooth anchor links
      window.__lenis = lenis;
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis)  lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;   // renders nothing
}

/**
 * Helper — smooth scroll to a section from anywhere in the app
 *
 * Usage:
 *   import { scrollTo } from "@/components/SmoothScroll";
 *   <button onClick={() => scrollTo("#about")}>Go to About</button>
 */
export function scrollTo(target, options = {}) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, {
      offset:   options.offset   ?? -80,   // account for fixed navbar
      duration: options.duration ?? 1.2,
      ...options,
    });
  } else {
    // Fallback for touch / no-lenis
    const el = typeof target === "string"
      ? document.querySelector(target)
      : target;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
