"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Default empty resume data ───────────────────────── */
const EMPTY = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  education: [{ degree: "", institution: "", period: "", gpa: "", details: "" }],
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  skills: [{ category: "", items: "" }],
  projects: [{ title: "", tech: "", description: "", link: "" }],
  certifications: "",
};

const SAMPLE = {
  name: "Abrar Hossain Zahin",
  title: "AI & ML Engineer",
  email: "your@email.com",
  phone: "+880 1XXX-XXXXXX",
  location: "Dhaka, Bangladesh",
  linkedin: "linkedin.com/in/md-abrar-hossain-zahin",
  github: "github.com/Zahin2470",
  website: "abrar-hossain-zahin-portfolio.vercel.app",
  summary: "Passionate AI/ML Engineer and researcher pursuing B.Sc. CSE at East West University. Experienced in Deep Learning, NLP, Computer Vision and Explainable AI. Published researcher with projects spanning medical imaging, green computing, and post-quantum cryptography.",
  education: [{ degree: "B.Sc. Computer Science & Engineering", institution: "East West University", period: "2022 – Present", gpa: "3.8/4.0", details: "Focus: Machine Learning, Deep Learning, NLP, Computer Vision, XAI" }],
  experience: [{ role: "AI/ML Research Student", company: "East West University", period: "2022 – Present", bullets: "Published 6+ research papers in medical AI, green computing and cryptography\nBuilt TumorXAI: explainable brain MRI tumor classifier using self-supervised learning\nDeveloped GreenNet: lightweight CNN with knowledge distillation for edge AI" }],
  skills: [
    { category: "AI / ML", items: "Python, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, HuggingFace" },
    { category: "Web Development", items: "TypeScript, React, Next.js, Tailwind CSS, Node.js" },
    { category: "DevOps & Tools", items: "Docker, Git, Jupyter, Linux" },
  ],
  projects: [
    { title: "ElderCare SuperApp", tech: "TypeScript, Next.js, AI", description: "Unified elderly care platform for Bangladesh integrating health tracking, emergency alerts and telemedicine.", link: "github.com/Zahin2470/ElderCare-SuperApp" },
    { title: "TumorXAI", tech: "Python, PyTorch, XAI", description: "Self-supervised deep learning framework for explainable brain MRI tumor classification.", link: "" },
  ],
  certifications: "Machine Learning Specialization – Coursera\nDeep Learning Specialization – DeepLearning.AI",
};

/* ─── Reusable UI pieces ──────────────────────────────── */
function Label({ children }) {
  return <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, className = "" }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors ${className}`} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none" />
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4 flex items-center gap-2">
      <span className="w-4 h-px bg-purple-400/40" />
      {children}
    </h3>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="mt-3 text-xs font-mono text-zinc-600 hover:text-purple-400 border border-zinc-800 hover:border-purple-500/40 px-3 py-1.5 rounded-lg transition-all duration-200">
      + {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="text-[10px] font-mono text-zinc-700 hover:text-red-400 transition-colors">
      ✕ remove
    </button>
  );
}

/* ─── Live Resume Preview ─────────────────────────────── */
function ResumePreview({ data }) {
  const hasContent = (v) => v && v.trim();

  return (
    <div id="resume-preview"
      className="bg-white text-zinc-900 rounded-xl shadow-2xl"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "11px", lineHeight: "1.5", padding: "36px 40px", minHeight: "780px" }}>

      {/* Header */}
      <div style={{ borderBottom: "2px solid #18181b", paddingBottom: "12px", marginBottom: "14px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", margin: 0, fontFamily: "Arial, sans-serif" }}>
          {data.name || "Your Name"}
        </h1>
        {hasContent(data.title) && (
          <p style={{ fontSize: "12px", color: "#7c3aed", fontWeight: "600", margin: "2px 0 6px", fontFamily: "Arial, sans-serif" }}>
            {data.title}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "10px", color: "#52525b", fontFamily: "Arial, sans-serif" }}>
          {hasContent(data.email)    && <span>✉ {data.email}</span>}
          {hasContent(data.phone)    && <span>✆ {data.phone}</span>}
          {hasContent(data.location) && <span>⌖ {data.location}</span>}
          {hasContent(data.linkedin) && <span>in {data.linkedin}</span>}
          {hasContent(data.github)   && <span>⎇ {data.github}</span>}
          {hasContent(data.website)  && <span>🌐 {data.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {hasContent(data.summary) && (
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>
            Professional Summary
          </h2>
          <p style={{ color: "#3f3f46" }}>{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education.some(e => hasContent(e.degree)) && (
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
            Education
          </h2>
          {data.education.filter(e => hasContent(e.degree)).map((e, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: "11px", fontFamily: "Arial, sans-serif" }}>{e.degree}</strong>
                <span style={{ fontSize: "10px", color: "#71717a", fontFamily: "Arial, sans-serif" }}>{e.period}</span>
              </div>
              <div style={{ color: "#52525b", fontFamily: "Arial, sans-serif" }}>
                {e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
              </div>
              {hasContent(e.details) && <div style={{ color: "#71717a", marginTop: "2px" }}>{e.details}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.some(e => hasContent(e.role)) && (
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
            Experience
          </h2>
          {data.experience.filter(e => hasContent(e.role)).map((e, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: "11px", fontFamily: "Arial, sans-serif" }}>{e.role}</strong>
                <span style={{ fontSize: "10px", color: "#71717a", fontFamily: "Arial, sans-serif" }}>{e.period}</span>
              </div>
              <div style={{ color: "#52525b", marginBottom: "4px", fontFamily: "Arial, sans-serif" }}>{e.company}</div>
              {hasContent(e.bullets) && (
                <ul style={{ margin: "0", paddingLeft: "14px" }}>
                  {e.bullets.split("\n").filter(b => b.trim()).map((b, j) => (
                    <li key={j} style={{ color: "#3f3f46", marginBottom: "2px" }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.some(s => hasContent(s.category)) && (
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
            Skills
          </h2>
          {data.skills.filter(s => hasContent(s.category)).map((s, i) => (
            <div key={i} style={{ marginBottom: "4px", display: "flex", gap: "6px" }}>
              <strong style={{ minWidth: "90px", color: "#18181b", fontFamily: "Arial, sans-serif" }}>{s.category}:</strong>
              <span style={{ color: "#3f3f46" }}>{s.items}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.some(p => hasContent(p.title)) && (
        <div style={{ marginBottom: "14px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
            Projects
          </h2>
          {data.projects.filter(p => hasContent(p.title)).map((p, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "Arial, sans-serif" }}>
                  {p.title}{p.tech ? ` — ${p.tech}` : ""}
                </strong>
                {hasContent(p.link) && <span style={{ fontSize: "10px", color: "#7c3aed", fontFamily: "Arial, sans-serif" }}>{p.link}</span>}
              </div>
              {hasContent(p.description) && <p style={{ color: "#3f3f46", margin: "2px 0 0" }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {hasContent(data.certifications) && (
        <div>
          <h2 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #e4e4e7", paddingBottom: "3px", marginBottom: "6px", fontFamily: "Arial, sans-serif" }}>
            Certifications
          </h2>
          <ul style={{ margin: "0", paddingLeft: "14px" }}>
            {data.certifications.split("\n").filter(c => c.trim()).map((c, i) => (
              <li key={i} style={{ color: "#3f3f46", marginBottom: "2px" }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function ResumeBuilder() {
  const [data, setData] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const setArr = (key, index, field, val) =>
    setData(d => ({ ...d, [key]: d[key].map((item, i) => i === index ? { ...item, [field]: val } : item) }));
  const addArr = (key, template) => setData(d => ({ ...d, [key]: [...d[key], template] }));
  const removeArr = (key, index) => setData(d => ({ ...d, [key]: d[key].filter((_, i) => i !== index) }));

  const loadSample = () => setData(SAMPLE);
  const clearAll = () => setData(EMPTY);

  const handlePrint = () => {
    const preview = document.getElementById("resume-preview");
    if (!preview) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>${data.name || "Resume"} — Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; font-size: 11px; color: #18181b; background: white; }
        @page { margin: 0.6in; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
      </head><body>${preview.innerHTML}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 300);
  };

  const tabs = [
    { id: "personal",   label: "Personal" },
    { id: "summary",    label: "Summary" },
    { id: "education",  label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills",     label: "Skills" },
    { id: "projects",   label: "Projects" },
    { id: "extra",      label: "Extra" },
  ];

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-20 pb-16" style={{ overflowX: "hidden" }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-700/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <br></br>
              <h1 className="font-black leading-none mb-2"
                style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                <span className="text-white">Resume </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Builder</span>
              </h1>
              <p className="text-zinc-500 text-sm">Fill in your details, see a live preview, then download as PDF.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={loadSample}
                className="text-xs font-mono px-3 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                Load Sample
              </button>
              <button onClick={clearAll}
                className="text-xs font-mono px-3 py-2 border border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 rounded-lg transition-all">
                Clear All
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 text-xs font-mono px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Main grid ──────────────────────────────────── */}
        <div className="grid xl:grid-cols-2 gap-6">

          {/* LEFT: Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>

            {/* Tab bar */}
            <div className="flex gap-1 flex-wrap mb-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1.5">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    activeTab === t.id
                      ? "bg-purple-600 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  }`}>
                  {activeTab === t.id && "▸ "}{t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}>

                  {/* ── Personal ── */}
                  {activeTab === "personal" && (
                    <div className="space-y-4">
                      <SectionTitle>Personal Information</SectionTitle>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><Label>Full Name *</Label><Input value={data.name} onChange={e => set("name", e.target.value)} placeholder="Abrar Hossain Zahin" /></div>
                        <div><Label>Professional Title</Label><Input value={data.title} onChange={e => set("title", e.target.value)} placeholder="AI & ML Engineer" /></div>
                        <div><Label>Email *</Label><Input value={data.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" /></div>
                        <div><Label>Phone</Label><Input value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+880 1XXX-XXXXXX" /></div>
                        <div><Label>Location</Label><Input value={data.location} onChange={e => set("location", e.target.value)} placeholder="Dhaka, Bangladesh" /></div>
                        <div><Label>LinkedIn</Label><Input value={data.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/..." /></div>
                        <div><Label>GitHub</Label><Input value={data.github} onChange={e => set("github", e.target.value)} placeholder="github.com/..." /></div>
                        <div><Label>Website / Portfolio</Label><Input value={data.website} onChange={e => set("website", e.target.value)} placeholder="yourportfolio.com" /></div>
                      </div>
                    </div>
                  )}

                  {/* ── Summary ── */}
                  {activeTab === "summary" && (
                    <div>
                      <SectionTitle>Professional Summary</SectionTitle>
                      <p className="text-xs text-zinc-600 font-mono mb-3">2–4 sentences. What you do, your expertise, and your goal.</p>
                      <Textarea value={data.summary} onChange={e => set("summary", e.target.value)}
                        placeholder="Passionate AI/ML engineer with expertise in deep learning and computer vision..."
                        rows={6} />
                      <p className="text-xs text-zinc-700 mt-2 font-mono">{data.summary.length} chars</p>
                    </div>
                  )}

                  {/* ── Education ── */}
                  {activeTab === "education" && (
                    <div>
                      <SectionTitle>Education</SectionTitle>
                      {data.education.map((e, i) => (
                        <div key={i} className="mb-5 p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>
                            {data.education.length > 1 && <RemoveBtn onClick={() => removeArr("education", i)} />}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2"><Label>Degree / Qualification *</Label>
                              <Input value={e.degree} onChange={ev => setArr("education", i, "degree", ev.target.value)} placeholder="B.Sc. Computer Science & Engineering" /></div>
                            <div><Label>Institution *</Label>
                              <Input value={e.institution} onChange={ev => setArr("education", i, "institution", ev.target.value)} placeholder="East West University" /></div>
                            <div><Label>Period</Label>
                              <Input value={e.period} onChange={ev => setArr("education", i, "period", ev.target.value)} placeholder="2022 – Present" /></div>
                            <div><Label>GPA / Grade</Label>
                              <Input value={e.gpa} onChange={ev => setArr("education", i, "gpa", ev.target.value)} placeholder="3.8 / 4.0" /></div>
                            <div><Label>Notable Courses / Details</Label>
                              <Input value={e.details} onChange={ev => setArr("education", i, "details", ev.target.value)} placeholder="Focus: ML, DL, NLP..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("education", { degree: "", institution: "", period: "", gpa: "", details: "" })} label="Add Education" />
                    </div>
                  )}

                  {/* ── Experience ── */}
                  {activeTab === "experience" && (
                    <div>
                      <SectionTitle>Work / Research Experience</SectionTitle>
                      {data.experience.map((e, i) => (
                        <div key={i} className="mb-5 p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>
                            {data.experience.length > 1 && <RemoveBtn onClick={() => removeArr("experience", i)} />}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div><Label>Role / Position *</Label>
                              <Input value={e.role} onChange={ev => setArr("experience", i, "role", ev.target.value)} placeholder="AI Research Engineer" /></div>
                            <div><Label>Company / Organisation *</Label>
                              <Input value={e.company} onChange={ev => setArr("experience", i, "company", ev.target.value)} placeholder="East West University" /></div>
                            <div className="sm:col-span-2"><Label>Period</Label>
                              <Input value={e.period} onChange={ev => setArr("experience", i, "period", ev.target.value)} placeholder="Jan 2023 – Present" /></div>
                            <div className="sm:col-span-2"><Label>Bullet Points (one per line)</Label>
                              <Textarea value={e.bullets} onChange={ev => setArr("experience", i, "bullets", ev.target.value)}
                                placeholder={"Built X that achieved Y\nReduced Z by 30% using..."} rows={4} /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("experience", { role: "", company: "", period: "", bullets: "" })} label="Add Experience" />
                    </div>
                  )}

                  {/* ── Skills ── */}
                  {activeTab === "skills" && (
                    <div>
                      <SectionTitle>Skills</SectionTitle>
                      <p className="text-xs text-zinc-600 font-mono mb-4">Group skills by category for a clean look.</p>
                      {data.skills.map((s, i) => (
                        <div key={i} className="mb-4 p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>
                            {data.skills.length > 1 && <RemoveBtn onClick={() => removeArr("skills", i)} />}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div><Label>Category *</Label>
                              <Input value={s.category} onChange={ev => setArr("skills", i, "category", ev.target.value)} placeholder="AI / ML" /></div>
                            <div><Label>Skills (comma separated) *</Label>
                              <Input value={s.items} onChange={ev => setArr("skills", i, "items", ev.target.value)} placeholder="Python, TensorFlow, PyTorch..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("skills", { category: "", items: "" })} label="Add Skill Category" />
                    </div>
                  )}

                  {/* ── Projects ── */}
                  {activeTab === "projects" && (
                    <div>
                      <SectionTitle>Projects</SectionTitle>
                      {data.projects.map((p, i) => (
                        <div key={i} className="mb-5 p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>
                            {data.projects.length > 1 && <RemoveBtn onClick={() => removeArr("projects", i)} />}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div><Label>Project Title *</Label>
                              <Input value={p.title} onChange={ev => setArr("projects", i, "title", ev.target.value)} placeholder="ElderCare SuperApp" /></div>
                            <div><Label>Tech Stack</Label>
                              <Input value={p.tech} onChange={ev => setArr("projects", i, "tech", ev.target.value)} placeholder="TypeScript, Next.js, AI" /></div>
                            <div className="sm:col-span-2"><Label>Description</Label>
                              <Textarea value={p.description} onChange={ev => setArr("projects", i, "description", ev.target.value)}
                                placeholder="What it does and what you achieved..." rows={3} /></div>
                            <div className="sm:col-span-2"><Label>Link (GitHub / Live)</Label>
                              <Input value={p.link} onChange={ev => setArr("projects", i, "link", ev.target.value)} placeholder="github.com/..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("projects", { title: "", tech: "", description: "", link: "" })} label="Add Project" />
                    </div>
                  )}

                  {/* ── Extra ── */}
                  {activeTab === "extra" && (
                    <div>
                      <SectionTitle>Certifications &amp; Awards</SectionTitle>
                      <p className="text-xs text-zinc-600 font-mono mb-3">One per line.</p>
                      <Textarea value={data.certifications} onChange={e => set("certifications", e.target.value)}
                        placeholder={"Machine Learning Specialization – Coursera\nDeep Learning Specialization – DeepLearning.AI"} rows={6} />
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile preview toggle */}
            <button onClick={() => setShowPreview(!showPreview)}
              className="xl:hidden mt-4 w-full py-3 border border-zinc-700 hover:border-purple-500/60 text-sm font-mono text-zinc-400 hover:text-purple-400 rounded-xl transition-all">
              {showPreview ? "← Hide Preview" : "Preview Resume →"}
            </button>
          </motion.div>

          {/* RIGHT: Live preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className={`${showPreview ? "block" : "hidden"} xl:block`}
          >
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/60 px-3 py-1.5 rounded-lg transition-all">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  Print / Save PDF
                </button>
              </div>
              <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/40 p-2 sm:p-3"
                style={{ maxHeight: "80vh" }}>
                <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "138.9%", pointerEvents: "none" }}>
                  <ResumePreview data={data} />
                </div>
              </div>
              <p className="text-center text-xs font-mono text-zinc-700 mt-2">
                Preview is scaled. PDF will be full size.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
