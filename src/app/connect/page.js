"use client";
import { motion } from "framer-motion";
import { socialLinks, siteConfig } from "@/lib/data";

export default function Connect() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Connect With Me
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl text-zinc-300 mb-14"
        >
          Open to collaborations, research opportunities, and exciting AI/ML projects.
        </motion.p>

        {/* Social links grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap justify-center gap-x-10 gap-y-6 text-lg font-medium mb-16"
        >
          {socialLinks.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              whileHover={{ color: "#c084fc", scale: 1.05 }}
              className="text-zinc-300 hover:text-purple-400 transition-all duration-300"
            >
              {s.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Let&apos;s work together</h2>
          <p className="text-zinc-400 mb-8">
            Whether it&apos;s a research collaboration, ML project, or just a conversation about AI — I&apos;d love to hear from you.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-full font-medium transition-colors text-lg"
          >
            Say Hello ✉️
          </a>
        </motion.div>

      </div>
    </div>
  );
}
