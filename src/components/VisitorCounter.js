"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const res = await fetch("/api/visitors");
        const data = await res.json();
        if (data.count !== null) {
          setCount(data.count);
          setReady(true);
        }
      } catch {}
    };

    const incrementOncePerSession = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem("visitor-counted");
        if (alreadyCounted) return;

        sessionStorage.setItem("visitor-counted", "1");

        const res = await fetch("/api/visitors", { method: "POST" });
        const data = await res.json();
        if (data.count !== null) {
          setCount(data.count);
          setReady(true);
        }
      } catch {}
    };

    loadCount();
    incrementOncePerSession();
  }, []);

  if (!ready || count === null) return null;

  const formatted = count.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-700 text-xs font-mono shadow-sm select-none"
      title="Total portfolio visits"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>

      <span className="text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
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