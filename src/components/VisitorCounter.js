"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [prev,  setPrev]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Increment on first visit, then poll every 30s for live updates
    const hit = async () => {
      try {
        const res  = await fetch("/api/visitors", { method: "POST" });
        const data = await res.json();
        if (data.count !== null) {
          setPrev(data.count - 1);
          setCount(data.count);
          setReady(true);
        }
      } catch { /* silently fail */ }
    };

    hit();

    // Refresh count every 30 seconds (show others joining)
    const poll = async () => {
      try {
        const res  = await fetch("/api/visitors");
        const data = await res.json();
        if (data.count !== null) {
          setCount(c => {
            if (data.count !== c) setPrev(c);
            return data.count;
          });
        }
      } catch { /* silently fail */ }
    };

    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!ready || count === null) return null;

  // Format with locale commas: 12345 → 12,345
  const formatted = count.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full
                 bg-zinc-900 dark:bg-zinc-900 border border-zinc-700
                 dark:border-zinc-700 text-xs font-mono
                 shadow-sm select-none"
      title="Total portfolio visits"
    >
      {/* Pulsing live dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>

      {/* Animated count flip */}
      <span className="text-zinc-500 dark:text-zinc-500">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{ y: 10,     opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block tabular-nums text-zinc-800 dark:text-zinc-200 font-bold"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
        {" "}visits
      </span>
    </motion.div>
  );
}
