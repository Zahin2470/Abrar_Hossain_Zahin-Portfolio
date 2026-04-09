"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center text-center px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-9xl font-bold text-purple-500/20 select-none mb-4">404</p>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-zinc-500 mb-8">This page doesn&apos;t exist yet.</p>
        <Link href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-medium transition-colors">
          ← Back Home
        </Link>
      </motion.div>
    </div>
  );
}
