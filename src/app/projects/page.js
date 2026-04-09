"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";

const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-zinc-400 text-lg">Things I&apos;ve built</p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-14"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === tag
                  ? "bg-purple-600 text-white"
                  : "border border-zinc-700 text-zinc-400 hover:border-purple-500 hover:text-purple-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -15 }}
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col"
              >
                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300`}>
                  {project.emoji}
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="shrink-0 text-xs px-2 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 mb-4 flex-1">{project.descriptionLong}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors"
                    >
                      View Project →
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white font-medium hover:underline transition-colors"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 py-20">No projects found for &quot;{active}&quot;</p>
        )}
      </div>
    </div>
  );
}
