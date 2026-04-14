"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Default data ────────────────────────────────────── */
const EMPTY = {
  name: "", title: "", email: "", phone: "", location: "",
  linkedin: "", github: "", website: "", summary: "",
  education:      [{ degree: "", institution: "", period: "", gpa: "", details: "" }],
  experience:     [{ role: "", company: "", period: "", bullets: "" }],
  skills:         [{ category: "", items: "" }],
  projects:       [{ title: "", tech: "", description: "", link: "" }],
  certifications: "",
};

const SAMPLE = {
  name: "Abrar Hossain Zahin", title: "AI & ML Engineer",
  email: "abrarhossain1200@gmail.com", phone: "+880 1749-498717",
  location: "Dhaka, Bangladesh",
  linkedin: "linkedin.com/in/md-abrar-hossain-zahin",
  github: "github.com/Zahin2470",
  website: "abrar-hossain-zahin-portfolio.vercel.app",
  summary: "Passionate AI/ML Engineer and researcher at East West University. Experienced in Deep Learning, NLP, Computer Vision and Explainable AI. Published researcher in medical imaging, green computing, and post-quantum cryptography.",
  education: [{ degree: "B.Sc. Computer Science & Engineering", institution: "East West University", period: "2022 – Present", gpa: "3.8/4.0", details: "Focus: Machine Learning, Deep Learning, NLP, Computer Vision, XAI" }],
  experience: [{ role: "AI/ML Research Student", company: "East West University", period: "2022 – Present", bullets: "Published 6+ research papers in medical AI, green computing and cryptography\nBuilt TumorXAI: explainable brain MRI tumor classifier using self-supervised learning\nDeveloped GreenNet: lightweight CNN with knowledge distillation for edge AI" }],
  skills: [
    { category: "AI / ML", items: "Python, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, HuggingFace" },
    { category: "Web", items: "TypeScript, React, Next.js, Tailwind CSS, Node.js" },
    { category: "DevOps", items: "Docker, Git, Jupyter, Linux" },
  ],
  projects: [
    { title: "ElderCare SuperApp", tech: "TypeScript, Next.js, AI", description: "Unified elderly care platform for Bangladesh with health tracking, emergency alerts and telemedicine.", link: "github.com/Zahin2470/ElderCare-SuperApp" },
    { title: "TumorXAI", tech: "Python, PyTorch, XAI", description: "Self-supervised deep learning framework for explainable brain MRI tumor classification.", link: "" },
  ],
  certifications: "Machine Learning Specialization – Coursera\nDeep Learning Specialization – DeepLearning.AI",
};

/* ─── Color themes ────────────────────────────────────── */
const THEMES = {
  violet:  { name: "Violet",  sidebar: "#4c1d95", accent: "#7c3aed", light: "#ede9fe", mid: "#8b5cf6", text: "#ffffff" },
  slate:   { name: "Slate",   sidebar: "#0f172a", accent: "#334155", light: "#e2e8f0", mid: "#475569", text: "#ffffff" },
  emerald: { name: "Emerald", sidebar: "#064e3b", accent: "#059669", light: "#d1fae5", mid: "#10b981", text: "#ffffff" },
  rose:    { name: "Rose",    sidebar: "#881337", accent: "#e11d48", light: "#ffe4e6", mid: "#f43f5e", text: "#ffffff" },
  indigo:  { name: "Indigo",  sidebar: "#1e1b4b", accent: "#4338ca", light: "#e0e7ff", mid: "#6366f1", text: "#ffffff" },
};

/* ─── Form helpers ────────────────────────────────────── */
const Label = ({ children }) => <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{children}</label>;
const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors" />
);
const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none" />
);
const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4 flex items-center gap-2">
    <span className="w-4 h-px bg-purple-400/40" />{children}
  </h3>
);
const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick}
    className="mt-3 text-xs font-mono text-zinc-600 hover:text-purple-400 border border-zinc-800 hover:border-purple-500/40 px-3 py-1.5 rounded-lg transition-all">
    + {label}
  </button>
);
const RemoveBtn = ({ onClick }) => (
  <button onClick={onClick} className="text-[10px] font-mono text-zinc-700 hover:text-red-400 transition-colors">✕ remove</button>
);

/* ─── MODERN SIDEBAR TEMPLATE ─────────────────────────── */
function TemplateSidebar({ data, theme }) {
  const t = THEMES[theme];
  const has = (v) => v && String(v).trim();

  return (
    <div id="resume-preview" style={{ display: "flex", width: "100%", minHeight: "900px", fontFamily: "'Arial', sans-serif", fontSize: "10px", lineHeight: "1.5", background: "#fff" }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: "34%", background: t.sidebar, color: t.text, padding: "32px 20px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0" }}>

        {/* Avatar / Initials */}
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "16px" }}>
          {(data.name || "??").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>

        {/* Name & Title */}
        <h1 style={{ fontSize: "17px", fontWeight: "800", margin: "0 0 3px", lineHeight: "1.2", letterSpacing: "-0.01em" }}>
          {data.name || "Your Name"}
        </h1>
        {has(data.title) && (
          <p style={{ fontSize: "10px", color: t.light, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 20px" }}>
            {data.title}
          </p>
        )}

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", margin: "0 0 18px" }} />

        {/* Contact */}
        <p style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: t.light, marginBottom: "10px" }}>Contact</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
          {[
            { icon: "✉", val: data.email },
            { icon: "✆", val: data.phone },
            { icon: "⌖", val: data.location },
            { icon: "in", val: data.linkedin },
            { icon: "⎇", val: data.github },
            { icon: "↗", val: data.website },
          ].filter(c => has(c.val)).map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "7px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "9px", color: t.light, minWidth: "12px", marginTop: "1px" }}>{c.icon}</span>
              <span style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.85)", wordBreak: "break-all", lineHeight: "1.4" }}>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {data.skills.some(s => has(s.category)) && (
          <>
            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", margin: "0 0 16px" }} />
            <p style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: t.light, marginBottom: "12px" }}>Skills</p>
            {data.skills.filter(s => has(s.category)).map((s, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <p style={{ fontSize: "8.5px", fontWeight: "700", color: t.light, marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.category}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {s.items.split(",").map(sk => sk.trim()).filter(Boolean).map((sk, j) => (
                    <span key={j} style={{ fontSize: "7.5px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", padding: "2px 6px", color: "rgba(255,255,255,0.9)" }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Certifications */}
        {has(data.certifications) && (
          <>
            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", margin: "8px 0 16px" }} />
            <p style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: t.light, marginBottom: "10px" }}>Certifications</p>
            {data.certifications.split("\n").filter(c => c.trim()).map((c, i) => (
              <p key={i} style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.85)", marginBottom: "5px", lineHeight: "1.4" }}>· {c}</p>
            ))}
          </>
        )}
      </div>

      {/* ── RIGHT MAIN ── */}
      <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", gap: "0" }}>

        {/* Summary */}
        {has(data.summary) && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ width: "20px", height: "3px", background: t.accent, borderRadius: "2px", display: "block" }} />
              <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, margin: 0 }}>Summary</h2>
            </div>
            <p style={{ color: "#374151", lineHeight: "1.6", fontSize: "9.5px" }}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.some(e => has(e.role)) && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ width: "20px", height: "3px", background: t.accent, borderRadius: "2px", display: "block" }} />
              <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, margin: 0 }}>Experience</h2>
            </div>
            {data.experience.filter(e => has(e.role)).map((e, i) => (
              <div key={i} style={{ marginBottom: "14px", paddingLeft: "12px", borderLeft: `2px solid ${t.light}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                  <strong style={{ fontSize: "10.5px", color: "#111827", fontWeight: "700" }}>{e.role}</strong>
                  <span style={{ fontSize: "8.5px", color: "#6b7280", background: t.light, padding: "1px 7px", borderRadius: "10px", whiteSpace: "nowrap", marginLeft: "8px" }}>{e.period}</span>
                </div>
                <p style={{ fontSize: "9px", color: t.accent, fontWeight: "600", marginBottom: "5px" }}>{e.company}</p>
                {has(e.bullets) && (
                  <ul style={{ margin: 0, paddingLeft: "13px" }}>
                    {e.bullets.split("\n").filter(b => b.trim()).map((b, j) => (
                      <li key={j} style={{ color: "#4b5563", marginBottom: "3px", fontSize: "9px", lineHeight: "1.5" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.some(e => has(e.degree)) && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ width: "20px", height: "3px", background: t.accent, borderRadius: "2px", display: "block" }} />
              <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, margin: 0 }}>Education</h2>
            </div>
            {data.education.filter(e => has(e.degree)).map((e, i) => (
              <div key={i} style={{ marginBottom: "12px", paddingLeft: "12px", borderLeft: `2px solid ${t.light}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                  <strong style={{ fontSize: "10.5px", color: "#111827", fontWeight: "700" }}>{e.degree}</strong>
                  <span style={{ fontSize: "8.5px", color: "#6b7280", background: t.light, padding: "1px 7px", borderRadius: "10px", whiteSpace: "nowrap", marginLeft: "8px" }}>{e.period}</span>
                </div>
                <p style={{ fontSize: "9px", color: t.accent, fontWeight: "600", marginBottom: "3px" }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</p>
                {has(e.details) && <p style={{ fontSize: "8.5px", color: "#6b7280", lineHeight: "1.4" }}>{e.details}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.some(p => has(p.title)) && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ width: "20px", height: "3px", background: t.accent, borderRadius: "2px", display: "block" }} />
              <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, margin: 0 }}>Projects</h2>
            </div>
            {data.projects.filter(p => has(p.title)).map((p, i) => (
              <div key={i} style={{ marginBottom: "10px", padding: "8px 10px", background: "#f9fafb", borderRadius: "6px", border: `1px solid ${t.light}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                  <strong style={{ fontSize: "10px", color: "#111827" }}>
                    {p.title}{p.tech ? <span style={{ fontWeight: "400", color: "#6b7280" }}> · {p.tech}</span> : ""}
                  </strong>
                  {has(p.link) && <span style={{ fontSize: "7.5px", color: t.accent }}>{p.link}</span>}
                </div>
                {has(p.description) && <p style={{ fontSize: "9px", color: "#4b5563", lineHeight: "1.5", margin: 0 }}>{p.description}</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── CLASSIC TOP-HEADER TEMPLATE ─────────────────────── */
function TemplateClassic({ data, theme }) {
  const t = THEMES[theme];
  const has = (v) => v && String(v).trim();

  return (
    <div id="resume-preview" style={{ background: "#fff", minHeight: "900px", fontFamily: "'Arial', sans-serif", fontSize: "10px", lineHeight: "1.5" }}>

      {/* Header bar */}
      <div style={{ background: t.sidebar, padding: "28px 36px 22px", color: "#fff" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 3px", letterSpacing: "-0.02em" }}>{data.name || "Your Name"}</h1>
        {has(data.title) && <p style={{ fontSize: "11px", color: t.light, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>{data.title}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
          {[
            { icon: "✉", val: data.email }, { icon: "✆", val: data.phone },
            { icon: "⌖", val: data.location }, { icon: "in", val: data.linkedin },
            { icon: "⎇", val: data.github }, { icon: "↗", val: data.website },
          ].filter(c => has(c.val)).map((c, i) => (
            <span key={i} style={{ fontSize: "9px", color: "rgba(255,255,255,0.85)" }}>{c.icon} {c.val}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 36px" }}>
        {/* Accent line */}
        <div style={{ height: "3px", background: `linear-gradient(to right, ${t.accent}, ${t.light})`, borderRadius: "2px", marginBottom: "20px" }} />

        {/* Two-column layout for body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 38%", gap: "28px" }}>

          {/* Left column */}
          <div>
            {has(data.summary) && (
              <div style={{ marginBottom: "18px" }}>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "8px" }}>Profile</h2>
                <p style={{ color: "#374151", lineHeight: "1.6", fontSize: "9.5px" }}>{data.summary}</p>
              </div>
            )}

            {data.experience.some(e => has(e.role)) && (
              <div style={{ marginBottom: "18px" }}>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "10px" }}>Experience</h2>
                {data.experience.filter(e => has(e.role)).map((e, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: "10.5px", color: "#111" }}>{e.role}</strong>
                      <span style={{ fontSize: "8.5px", color: "#9ca3af" }}>{e.period}</span>
                    </div>
                    <p style={{ fontSize: "9px", color: t.accent, fontWeight: "600", margin: "1px 0 4px" }}>{e.company}</p>
                    {has(e.bullets) && (
                      <ul style={{ margin: 0, paddingLeft: "14px" }}>
                        {e.bullets.split("\n").filter(b => b.trim()).map((b, j) => (
                          <li key={j} style={{ color: "#4b5563", marginBottom: "2px", fontSize: "9px" }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data.projects.some(p => has(p.title)) && (
              <div>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "10px" }}>Projects</h2>
                {data.projects.filter(p => has(p.title)).map((p, i) => (
                  <div key={i} style={{ marginBottom: "9px" }}>
                    <strong style={{ fontSize: "10px", color: "#111" }}>{p.title}</strong>
                    {p.tech && <span style={{ fontSize: "8.5px", color: "#9ca3af" }}> · {p.tech}</span>}
                    {has(p.description) && <p style={{ fontSize: "9px", color: "#4b5563", margin: "2px 0 0", lineHeight: "1.5" }}>{p.description}</p>}
                    {has(p.link) && <p style={{ fontSize: "8px", color: t.accent, margin: "1px 0 0" }}>{p.link}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div>
            {data.education.some(e => has(e.degree)) && (
              <div style={{ marginBottom: "18px" }}>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "10px" }}>Education</h2>
                {data.education.filter(e => has(e.degree)).map((e, i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <strong style={{ fontSize: "9.5px", color: "#111" }}>{e.degree}</strong>
                    <p style={{ fontSize: "8.5px", color: t.accent, fontWeight: "600", margin: "1px 0 1px" }}>{e.institution}</p>
                    <p style={{ fontSize: "8px", color: "#9ca3af" }}>{e.period}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</p>
                    {has(e.details) && <p style={{ fontSize: "8px", color: "#6b7280", marginTop: "2px" }}>{e.details}</p>}
                  </div>
                ))}
              </div>
            )}

            {data.skills.some(s => has(s.category)) && (
              <div style={{ marginBottom: "18px" }}>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "10px" }}>Skills</h2>
                {data.skills.filter(s => has(s.category)).map((s, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "8.5px", color: "#111", display: "block", marginBottom: "3px" }}>{s.category}</strong>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                      {s.items.split(",").map(sk => sk.trim()).filter(Boolean).map((sk, j) => (
                        <span key={j} style={{ fontSize: "7.5px", background: t.light, color: t.accent, borderRadius: "4px", padding: "2px 6px", fontWeight: "600" }}>{sk}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {has(data.certifications) && (
              <div>
                <h2 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent, borderBottom: `2px solid ${t.light}`, paddingBottom: "4px", marginBottom: "8px" }}>Certifications</h2>
                {data.certifications.split("\n").filter(c => c.trim()).map((c, i) => (
                  <p key={i} style={{ fontSize: "8.5px", color: "#4b5563", marginBottom: "4px" }}>· {c}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MINIMAL TEMPLATE ────────────────────────────────── */
function TemplateMinimal({ data, theme }) {
  const t = THEMES[theme];
  const has = (v) => v && String(v).trim();

  return (
    <div id="resume-preview" style={{ background: "#fff", minHeight: "900px", fontFamily: "'Arial', sans-serif", fontSize: "10px", lineHeight: "1.5", padding: "40px 44px" }}>

      {/* Top accent line */}
      <div style={{ height: "4px", background: t.accent, borderRadius: "2px", marginBottom: "28px" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.03em", margin: "0 0 3px" }}>{data.name || "Your Name"}</h1>
          {has(data.title) && <p style={{ fontSize: "11px", color: t.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{data.title}</p>}
        </div>
        <div style={{ textAlign: "right", fontSize: "8.5px", color: "#6b7280", lineHeight: "1.7" }}>
          {has(data.email)    && <div>✉ {data.email}</div>}
          {has(data.phone)    && <div>✆ {data.phone}</div>}
          {has(data.location) && <div>⌖ {data.location}</div>}
          {has(data.linkedin) && <div>in {data.linkedin}</div>}
          {has(data.github)   && <div>⎇ {data.github}</div>}
        </div>
      </div>

      {/* Full-width divider */}
      <div style={{ height: "1px", background: "#e5e7eb", marginBottom: "22px" }} />

      {/* Summary */}
      {has(data.summary) && (
        <div style={{ marginBottom: "22px" }}>
          <p style={{ color: "#374151", lineHeight: "1.7", fontSize: "9.5px", borderLeft: `3px solid ${t.accent}`, paddingLeft: "12px", fontStyle: "italic" }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.some(e => has(e.role)) && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: t.accent, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            Experience <span style={{ flex: 1, height: "1px", background: "#e5e7eb", display: "block" }} />
          </h2>
          {data.experience.filter(e => has(e.role)).map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "16% 84%", gap: "0 16px", marginBottom: "14px" }}>
              <div style={{ paddingTop: "1px" }}>
                <p style={{ fontSize: "8px", color: "#9ca3af", lineHeight: "1.4" }}>{e.period}</p>
                <p style={{ fontSize: "8.5px", color: t.accent, fontWeight: "600", lineHeight: "1.4" }}>{e.company}</p>
              </div>
              <div>
                <strong style={{ fontSize: "10.5px", color: "#0f172a" }}>{e.role}</strong>
                {has(e.bullets) && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {e.bullets.split("\n").filter(b => b.trim()).map((b, j) => (
                      <li key={j} style={{ color: "#4b5563", marginBottom: "2px", fontSize: "9px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two columns: education + skills/certs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
        <div>
          {data.education.some(e => has(e.degree)) && (
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: t.accent, marginBottom: "10px" }}>Education</h2>
              {data.education.filter(e => has(e.degree)).map((e, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <strong style={{ fontSize: "9.5px", color: "#0f172a" }}>{e.degree}</strong>
                  <p style={{ fontSize: "8.5px", color: "#374151", margin: "1px 0" }}>{e.institution}</p>
                  <p style={{ fontSize: "8px", color: "#9ca3af" }}>{e.period}{e.gpa ? ` · GPA ${e.gpa}` : ""}</p>
                  {has(e.details) && <p style={{ fontSize: "8px", color: "#6b7280", marginTop: "2px" }}>{e.details}</p>}
                </div>
              ))}
            </div>
          )}
          {data.projects.some(p => has(p.title)) && (
            <div>
              <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: t.accent, marginBottom: "10px" }}>Projects</h2>
              {data.projects.filter(p => has(p.title)).map((p, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <strong style={{ fontSize: "9.5px", color: "#0f172a" }}>{p.title}</strong>
                  {p.tech && <span style={{ fontSize: "8px", color: "#9ca3af" }}> · {p.tech}</span>}
                  {has(p.description) && <p style={{ fontSize: "8.5px", color: "#4b5563", margin: "1px 0 0" }}>{p.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {data.skills.some(s => has(s.category)) && (
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: t.accent, marginBottom: "10px" }}>Skills</h2>
              {data.skills.filter(s => has(s.category)).map((s, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <p style={{ fontSize: "8.5px", fontWeight: "700", color: "#111", marginBottom: "3px" }}>{s.category}</p>
                  <p style={{ fontSize: "8.5px", color: "#4b5563" }}>{s.items}</p>
                </div>
              ))}
            </div>
          )}
          {has(data.certifications) && (
            <div>
              <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", color: t.accent, marginBottom: "8px" }}>Certifications</h2>
              {data.certifications.split("\n").filter(c => c.trim()).map((c, i) => (
                <p key={i} style={{ fontSize: "8.5px", color: "#4b5563", marginBottom: "4px" }}>· {c}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function ResumeBuilder() {
  const [data, setData] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [template, setTemplate] = useState("sidebar");
  const [theme, setTheme] = useState("violet");

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const setArr = (key, i, field, val) =>
    setData(d => ({ ...d, [key]: d[key].map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));
  const addArr = (key, tpl) => setData(d => ({ ...d, [key]: [...d[key], tpl] }));
  const removeArr = (key, i) => setData(d => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }));

  const t = THEMES[theme];

  const handlePrint = () => {
    const preview = document.getElementById("resume-preview");
    if (!preview) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${data.name || "Resume"}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:white; }
        @page { margin: 0; size: A4; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      </style>
      </head><body>${preview.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  const PreviewComponent = template === "sidebar" ? TemplateSidebar : template === "classic" ? TemplateClassic : TemplateMinimal;

  const tabs = [
    { id: "personal", label: "Personal" }, { id: "summary", label: "Summary" },
    { id: "education", label: "Education" }, { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" }, { id: "projects", label: "Projects" },
    { id: "extra", label: "Extra" },
  ];

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-20 pb-16" style={{ overflowX: "hidden" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-700/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <br></br>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-black leading-none mb-2"
                style={{ fontSize: "clamp(2rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
                <span className="text-white">Resume </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Builder</span>
              </h1>
              <p className="text-zinc-500 text-sm">Pick a template · choose a color · fill in details · download PDF</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button onClick={() => setData(SAMPLE)} className="text-xs font-mono px-3 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">Load Sample</button>
              <button onClick={() => setData(EMPTY)} className="text-xs font-mono px-3 py-2 border border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 rounded-lg transition-all">Clear</button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 text-xs font-mono px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Template + Theme pickers */}
          <div className="flex flex-wrap gap-6 items-start">

            {/* Template picker */}
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Template</p>
              <div className="flex gap-2">
                {[
                  { id: "sidebar", label: "Sidebar", icon: "⬛▭" },
                  { id: "classic", label: "Classic", icon: "▬▬" },
                  { id: "minimal", label: "Minimal", icon: "—" },
                ].map((tpl) => (
                  <button key={tpl.id} onClick={() => setTemplate(tpl.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                      template === tpl.id
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}>
                    <span className="mr-1 text-base">{tpl.icon}</span> {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color theme picker */}
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Color Theme</p>
              <div className="flex gap-2">
                {Object.entries(THEMES).map(([key, val]) => (
                  <button key={key} onClick={() => setTheme(key)}
                    title={val.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${theme === key ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                    style={{ background: val.sidebar }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid xl:grid-cols-2 gap-6">

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex gap-1 flex-wrap mb-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1.5">
              {tabs.map((tb) => (
                <button key={tb.id} onClick={() => setActiveTab(tb.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    activeTab === tb.id ? "bg-purple-600 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  }`}>
                  {activeTab === tb.id && "▸ "}{tb.label}
                </button>
              ))}
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

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
                        <div><Label>Website / Portfolio</Label><Input value={data.website} onChange={e => set("website", e.target.value)} placeholder="yoursite.vercel.app" /></div>
                      </div>
                    </div>
                  )}

                  {activeTab === "summary" && (
                    <div>
                      <SectionTitle>Professional Summary</SectionTitle>
                      <p className="text-xs text-zinc-600 font-mono mb-3">2–4 sentences about your expertise and goals.</p>
                      <Textarea value={data.summary} onChange={e => set("summary", e.target.value)}
                        placeholder="Passionate AI/ML engineer with expertise in deep learning and computer vision..." rows={6} />
                      <p className="text-xs text-zinc-700 mt-2 font-mono">{data.summary.length} chars</p>
                    </div>
                  )}

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
                            <div className="sm:col-span-2"><Label>Degree *</Label><Input value={e.degree} onChange={ev => setArr("education", i, "degree", ev.target.value)} placeholder="B.Sc. Computer Science & Engineering" /></div>
                            <div><Label>Institution *</Label><Input value={e.institution} onChange={ev => setArr("education", i, "institution", ev.target.value)} placeholder="East West University" /></div>
                            <div><Label>Period</Label><Input value={e.period} onChange={ev => setArr("education", i, "period", ev.target.value)} placeholder="2022 – Present" /></div>
                            <div><Label>GPA</Label><Input value={e.gpa} onChange={ev => setArr("education", i, "gpa", ev.target.value)} placeholder="3.7" /></div>
                            <div><Label>Details</Label><Input value={e.details} onChange={ev => setArr("education", i, "details", ev.target.value)} placeholder="Focus: ML, DL, NLP..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("education", { degree: "", institution: "", period: "", gpa: "", details: "" })} label="Add Education" />
                    </div>
                  )}

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
                            <div><Label>Role *</Label><Input value={e.role} onChange={ev => setArr("experience", i, "role", ev.target.value)} placeholder="AI Research Engineer" /></div>
                            <div><Label>Company *</Label><Input value={e.company} onChange={ev => setArr("experience", i, "company", ev.target.value)} placeholder="East West University" /></div>
                            <div className="sm:col-span-2"><Label>Period</Label><Input value={e.period} onChange={ev => setArr("experience", i, "period", ev.target.value)} placeholder="Jan 2023 – Present" /></div>
                            <div className="sm:col-span-2"><Label>Bullet Points (one per line)</Label>
                              <Textarea value={e.bullets} onChange={ev => setArr("experience", i, "bullets", ev.target.value)}
                                placeholder={"Built X that achieved Y\nReduced Z by 30% using..."} rows={4} /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("experience", { role: "", company: "", period: "", bullets: "" })} label="Add Experience" />
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div>
                      <SectionTitle>Skills</SectionTitle>
                      <p className="text-xs text-zinc-600 font-mono mb-4">Group skills by category.</p>
                      {data.skills.map((s, i) => (
                        <div key={i} className="mb-4 p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>
                            {data.skills.length > 1 && <RemoveBtn onClick={() => removeArr("skills", i)} />}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div><Label>Category *</Label><Input value={s.category} onChange={ev => setArr("skills", i, "category", ev.target.value)} placeholder="AI / ML" /></div>
                            <div><Label>Skills (comma separated) *</Label><Input value={s.items} onChange={ev => setArr("skills", i, "items", ev.target.value)} placeholder="Python, TensorFlow, PyTorch..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("skills", { category: "", items: "" })} label="Add Skill Category" />
                    </div>
                  )}

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
                            <div><Label>Title *</Label><Input value={p.title} onChange={ev => setArr("projects", i, "title", ev.target.value)} placeholder="ElderCare SuperApp" /></div>
                            <div><Label>Tech Stack</Label><Input value={p.tech} onChange={ev => setArr("projects", i, "tech", ev.target.value)} placeholder="TypeScript, Next.js, AI" /></div>
                            <div className="sm:col-span-2"><Label>Description</Label><Textarea value={p.description} onChange={ev => setArr("projects", i, "description", ev.target.value)} placeholder="What it does and what you achieved..." rows={3} /></div>
                            <div className="sm:col-span-2"><Label>Link</Label><Input value={p.link} onChange={ev => setArr("projects", i, "link", ev.target.value)} placeholder="github.com/..." /></div>
                          </div>
                        </div>
                      ))}
                      <AddBtn onClick={() => addArr("projects", { title: "", tech: "", description: "", link: "" })} label="Add Project" />
                    </div>
                  )}

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

            <button onClick={() => setShowPreview(!showPreview)}
              className="xl:hidden mt-4 w-full py-3 border border-zinc-700 hover:border-purple-500/60 text-sm font-mono text-zinc-400 hover:text-purple-400 rounded-xl transition-all">
              {showPreview ? "← Hide Preview" : "Preview Resume →"}
            </button>
          </motion.div>

          {/* Live Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className={`${showPreview ? "block" : "hidden"} xl:block`}>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border text-zinc-500 border-zinc-700" style={{ borderColor: t.sidebar + "60", color: t.mid }}>
                    {THEMES[theme].name}
                  </span>
                </div>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/60 px-3 py-1.5 rounded-lg transition-all">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  Print / Save PDF
                </button>
              </div>
              <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-800/30 p-2 shadow-2xl" style={{ maxHeight: "78vh" }}>
                <div style={{ transform: "scale(0.70)", transformOrigin: "top left", width: "142.8%", pointerEvents: "none" }}>
                  <PreviewComponent data={data} theme={theme} />
                </div>
              </div>
              <p className="text-center text-xs font-mono text-zinc-700 mt-2">Scaled preview · PDF exports at full A4 size</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
