"use client";
import { motion } from "framer-motion";
import { researchPapers } from "@/lib/data";

export default function Research() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Research
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Academic contributions spanning medical imaging, explainable AI, green computing, and post-quantum cryptography.
          </p>
        </motion.div>

        {/* Papers */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {researchPapers.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -12 }}
              className="group bg-zinc-900 rounded-3xl p-8 hover:bg-zinc-800 transition-all duration-300 border border-zinc-800 hover:border-purple-500/40 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${paper.iconGradient} rounded-2xl flex items-center justify-center text-xl shrink-0`}>
                  {paper.emoji}
                </div>
                <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Research Paper</span>
              </div>
              <h3 className="text-lg font-semibold leading-snug mb-3 group-hover:text-purple-400 transition-colors flex-1">
                {paper.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-4">Focus: {paper.focus}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {paper.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
              {paper.url ? (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors mt-auto"
                >
                  View Paper ↗
                </a>
              ) : (
                <span className="text-xs text-zinc-600 mt-auto">Under review / coming soon</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Google Scholar CTA */}
        <div className="text-center">
          <a
            href="https://scholar.google.com/citations?user=PggflFIAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 font-medium transition-colors"
          >
            View All on Google Scholar →
          </a>
        </div>

      </div>
    </div>
  );
}
