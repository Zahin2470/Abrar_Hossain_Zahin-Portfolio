"use client";
import { motion } from "framer-motion";
import { siteConfig, skills, education, socialLinks } from "@/lib/data";

const categories = [
  { label: "AI/ML",   color: "from-purple-500 to-pink-500" },
  { label: "Web",     color: "from-blue-500 to-cyan-500" },
  { label: "DevOps",  color: "from-emerald-500 to-teal-500" },
];

export default function About() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            About Me
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">{siteConfig.bio}</p>
        </motion.div>

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-2 gap-6 mb-20"
        >
          {[
            { label: "🎓 University",  value: siteConfig.university },
            { label: "📚 Degree",      value: siteConfig.degree },
            { label: "📍 Location",    value: siteConfig.location },
            { label: "🔬 Focus Areas", value: "ML · Deep Learning · NLP · Computer Vision · XAI" },
            { label: "📧 Email",       value: siteConfig.email },
            { label: "📄 Resume",      value: "Available on request", link: siteConfig.resumeUrl },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4 items-start hover:border-purple-500/50 transition-colors"
            >
              <span className="text-sm text-zinc-500 min-w-[140px]">{item.label}</span>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-purple-400 hover:underline">
                  {item.value}
                </a>
              ) : (
                <span className="text-sm font-medium text-zinc-200">{item.value}</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-10">Education</h2>
          {education.map((edu, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex flex-wrap justify-between gap-3 mb-2">
                <h3 className="text-xl font-semibold text-purple-300">{edu.degree}</h3>
                <span className="text-xs font-medium px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full">
                  {edu.period}
                </span>
              </div>
              <p className="text-zinc-400 mb-2">{edu.institution} · {edu.location}</p>
              <p className="text-zinc-500 text-sm">{edu.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-10">Skills &amp; Technologies</h2>
          <div className="space-y-12">
            {categories.map(({ label, color }) => {
              const items = skills.filter((s) => s.category === label);
              return (
                <div key={label}>
                  <h3 className={`text-sm font-semibold uppercase tracking-widest mb-5 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {label}
                  </h3>
                  <div className="space-y-3">
                    {items.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-zinc-200">{skill.name}</span>
                          <span className="text-xs text-zinc-500">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Find Me Online</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full border border-zinc-700 text-sm font-medium text-zinc-300 hover:border-purple-500 hover:text-purple-400 transition-all duration-200"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
