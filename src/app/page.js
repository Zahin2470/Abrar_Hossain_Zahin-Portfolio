"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig, skills, projects, researchPapers } from "@/lib/data";

const skillNames = ["Python","TensorFlow","PyTorch","TypeScript","React","Next.js","Tailwind","Pandas","OpenCV","Docker","Git","Jupyter"];

export default function Home() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 z-0" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          {/* Profile image — replace inner div with <img> once you add your photo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            className="w-56 h-56 mx-auto mb-10 rounded-full overflow-hidden border-8 border-purple-500 shadow-2xl ring-4 ring-purple-500/30"
          >
            {/*
              Once you add your photo at /public/images/profile/developer-pic-1.png
              replace this div with:
              <img
                src="/images/profile/developer-pic-1.png"
                alt="Abrar Hossain Zahin"
                className="w-full h-full object-cover"
              />
            */}
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-5xl font-bold">
              AZ
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="text-3xl md:text-4xl text-purple-400 mb-8 font-semibold"
          >
            {siteConfig.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-2xl mx-auto text-lg text-zinc-300 leading-relaxed"
          >
            {siteConfig.bioLong}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/projects" className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors font-medium">
              View Projects →
            </Link>
            <Link href="/about" className="px-8 py-3 rounded-full border border-zinc-700 hover:border-purple-500 hover:text-purple-400 transition-all font-medium">
              About Me
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About preview */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl font-bold mb-10"
          >
            About Me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-300 leading-relaxed"
          >
            {siteConfig.bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/about" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4">
              Learn more about me →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16"
          >
            Skills &amp; Technologies
          </motion.h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {skillNames.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.08 }}
                className="bg-zinc-800 hover:bg-purple-600 p-6 rounded-3xl text-center text-purple-200 font-medium transition-all duration-300 cursor-default"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-5xl font-bold"
            >
              Featured Projects
            </motion.h2>
            <Link href="/projects" className="text-purple-400 hover:text-purple-300 font-medium hidden md:block">
              All projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -15 }}
                className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300`}>
                  {project.emoji}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-zinc-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
                    View Project →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="py-24 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-5xl font-bold"
            >
              Research Papers &amp; Publications
            </motion.h2>
            <Link href="/research" className="text-purple-400 hover:text-purple-300 font-medium hidden md:block">
              All papers →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {researchPapers.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -12 }}
                className="group bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${paper.iconGradient} rounded-2xl flex items-center justify-center text-xl`}>
                    {paper.emoji}
                  </div>
                  <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Research Paper</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug mb-3 group-hover:text-purple-400 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-zinc-400 text-sm">Focus: {paper.focus}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors">
              View All on Google Scholar →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
