// ─────────────────────────────────────────────────────────────────
// COVER PAGE BUILDER — Add this as a new tab inside resume-builder/page.js
// OR as a standalone page at /cover-page
//
// Based on EWU (East West University) official cover page format:
// Department, Course Code/Title, Assignment, Section, Semester,
// Student name/ID table, Submitted To, Date
// ─────────────────────────────────────────────────────────────────

"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── EWU Departments ─────────────────────────────────────── */
const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Electrical and Electronic Engineering",
  "Business Administration",
  "Economics",
  "English",
  "Law",
  "Pharmacy",
  "Public Health",
  "Biotechnology and Genetic Engineering",
  "Mathematics and Statistics",
];

const SEMESTERS = ["Spring 2026","Summer 2026","Fall 2026","Spring 2025","Summer 2025","Fall 2025"];

/* ── Input helper ─────────────────────────────────────────── */
const Label = ({ children }) => (
  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">{children}</label>
);
const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors" />
);
const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange}
    className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

/* ── Cover Page Preview (prints as A4) ───────────────────── */
function CoverPreview({ data }) {
  return (
    <div id="ewu-cover-preview" style={{
      width: "210mm", minHeight: "297mm",
      background: "#fff", color: "#000",
      fontFamily: "'Times New Roman', serif",
      padding: "25mm 20mm", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 0,
      fontSize: "12pt", lineHeight: 1.6,
    }}>

      {/* University Logo + Name */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        {/* EWU Logo placeholder — replace with actual logo img */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: "3px solid #1a3a6e",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 10px",
          background: "#1a3a6e",
          color: "#fff", fontWeight: "bold", fontSize: "14pt",
        }}>EWU</div>
        <div style={{ fontSize: "16pt", fontWeight: "bold", color: "#1a3a6e" }}>
          East West University
        </div>
        <div style={{ fontSize: "12pt", color: "#333", marginTop: 4 }}>
          Dhaka, Bangladesh
        </div>
      </div>

      {/* Horizontal rule */}
      <div style={{ width: "100%", height: 2, background: "#1a3a6e", marginBottom: 20 }} />

      {/* Department */}
      <div style={{ fontSize: "14pt", fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Department of {data.department}
      </div>

      {/* Course info table */}
      <table style={{ width: "80%", borderCollapse: "collapse", marginBottom: 20 }}>
        <tbody>
          {[
            ["Course Code",  data.courseCode],
            ["Course Title", data.courseTitle],
            ["Assignment",   data.assignment],
            ["Section",      data.section],
            ["Semester",     data.semester],
          ].map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "5px 12px", fontWeight: "bold", border: "1px solid #999", width: "40%", background: "#f5f5f5" }}>{label}</td>
              <td style={{ padding: "5px 12px", border: "1px solid #999" }}>{value || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submitted By */}
      <div style={{ fontWeight: "bold", fontSize: "13pt", marginBottom: 8, alignSelf: "flex-start", marginLeft: "10%" }}>
        Submitted By
      </div>
      <table style={{ width: "80%", borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 12px", border: "1px solid #999", background: "#1a3a6e", color: "#fff", textAlign: "left" }}>Name</th>
            <th style={{ padding: "6px 12px", border: "1px solid #999", background: "#1a3a6e", color: "#fff", textAlign: "left" }}>Student ID</th>
          </tr>
        </thead>
        <tbody>
          {data.students.filter(s => s.name).map((s, i) => (
            <tr key={i}>
              <td style={{ padding: "6px 12px", border: "1px solid #999" }}>{s.name}</td>
              <td style={{ padding: "6px 12px", border: "1px solid #999" }}>{s.id}</td>
            </tr>
          ))}
          {data.students.filter(s => s.name).length === 0 && (
            <tr>
              <td colSpan={2} style={{ padding: "6px 12px", border: "1px solid #999", color: "#999", textAlign: "center" }}>Enter student details →</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Submitted To */}
      <div style={{ alignSelf: "flex-start", marginLeft: "10%", marginBottom: 20 }}>
        <div style={{ fontWeight: "bold", fontSize: "13pt", marginBottom: 4 }}>Submitted To</div>
        <div style={{ fontWeight: "bold" }}>{data.teacherName || "Teacher Name"}</div>
        <div>{data.teacherDesignation || "Designation"}</div>
        <div>Department of {data.department}</div>
        <div>East West University</div>
      </div>

      {/* Horizontal rule */}
      <div style={{ width: "100%", height: 1, background: "#1a3a6e", marginTop: "auto", marginBottom: 10 }} />

      {/* Date */}
      <div style={{ textAlign: "center", fontSize: "11pt", color: "#333" }}>
        Date of Submission: <strong>{data.submissionDate || "—"}</strong>
      </div>
    </div>
  );
}

/* ── Main Cover Page Builder ─────────────────────────────── */
export default function CoverPageBuilder() {
  const [data, setData] = useState({
    department:          "Computer Science and Engineering",
    courseCode:          "",
    courseTitle:         "",
    assignment:          "",
    section:             "",
    semester:            SEMESTERS[0],
    students:            [{ name: "", id: "" }, { name: "", id: "" }],
    teacherName:         "",
    teacherDesignation:  "Lecturer",
    submissionDate:      "",
  });
  const [showPreview, setShowPreview] = useState(false);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setStudent = (i, field, val) =>
    setData(d => ({ ...d, students: d.students.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  const addStudent = () =>
    setData(d => ({ ...d, students: [...d.students, { name: "", id: "" }] }));
  const removeStudent = (i) =>
    setData(d => ({ ...d, students: d.students.filter((_, idx) => idx !== i) }));

  const handlePrint = () => {
    const preview = document.getElementById("ewu-cover-preview");
    if (!preview) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>EWU Cover Page</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:white; }
        @page { margin:0; size:A4; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      </style>
      </head><body>${preview.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-24 pb-20" style={{ overflowX: "hidden" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize: "72px 72px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <p className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-3">EWU Cover Page Builder</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="font-black leading-none mb-2"
                style={{ fontSize:"clamp(2rem,3vw,2.5rem)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.03em" }}>
                <span className="text-white">Cover Page </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Builder</span>
              </h1>
              <p className="text-zinc-500 text-sm">East West University · Official Assignment Format · Download PDF</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-mono px-4 py-2 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white rounded-lg transition-all xl:hidden">
                {showPreview ? "← Form" : "Preview →"}
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 text-xs font-mono px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-2 gap-6">

          {/* ── FORM ── */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
            className={`${showPreview ? "hidden" : "block"} xl:block`}>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">

              <div>
                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-4">Course Information</p>
                <div className="space-y-3">
                  <div><Label>Department *</Label><Select value={data.department} onChange={e => set("department", e.target.value)} options={DEPARTMENTS} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Course Code *</Label><Input value={data.courseCode} onChange={e => set("courseCode", e.target.value)} placeholder="CSE430" /></div>
                    <div><Label>Section</Label><Input value={data.section} onChange={e => set("section", e.target.value)} placeholder="02" /></div>
                  </div>
                  <div><Label>Course Title *</Label><Input value={data.courseTitle} onChange={e => set("courseTitle", e.target.value)} placeholder="Software Quality Assurance" /></div>
                  <div><Label>Assignment / Topic *</Label><Input value={data.assignment} onChange={e => set("assignment", e.target.value)} placeholder="Software Testing" /></div>
                  <div><Label>Semester *</Label><Select value={data.semester} onChange={e => set("semester", e.target.value)} options={SEMESTERS} /></div>
                  <div><Label>Submission Date</Label><Input value={data.submissionDate} onChange={e => set("submissionDate", e.target.value)} placeholder="12 April, 2026" /></div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-5">
                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-4">Students</p>
                <div className="space-y-2">
                  {data.students.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-xs font-mono text-zinc-700 pt-2.5 w-5">{i+1}.</span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input value={s.name} onChange={e => setStudent(i, "name", e.target.value)} placeholder="Full Name" />
                        <Input value={s.id} onChange={e => setStudent(i, "id", e.target.value)} placeholder="2022-2-60-040" />
                      </div>
                      {data.students.length > 1 && (
                        <button onClick={() => removeStudent(i)} className="text-zinc-700 hover:text-red-400 pt-2 text-xs transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={addStudent}
                    className="text-xs font-mono text-zinc-600 hover:text-purple-400 border border-zinc-800 hover:border-purple-500/40 px-3 py-1.5 rounded-lg transition-all mt-1">
                    + Add Student
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-5">
                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-4">Submitted To</p>
                <div className="space-y-3">
                  <div><Label>Teacher Name *</Label><Input value={data.teacherName} onChange={e => set("teacherName", e.target.value)} placeholder="Md Sabbir Hossain" /></div>
                  <div><Label>Designation</Label><Input value={data.teacherDesignation} onChange={e => set("teacherDesignation", e.target.value)} placeholder="Lecturer" /></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── PREVIEW ── */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
            className={`${showPreview ? "block" : "hidden"} xl:block`}>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-zinc-500">Live Preview</p>
                <button onClick={handlePrint}
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/60 px-3 py-1.5 rounded-lg transition-all">
                  Print / Save PDF
                </button>
              </div>
              <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-800/30 p-2 shadow-2xl" style={{ maxHeight:"80vh" }}>
                <div style={{ transform:"scale(0.62)", transformOrigin:"top left", width:"161%", pointerEvents:"none" }}>
                  <CoverPreview data={data} />
                </div>
              </div>
              <p className="text-center text-xs font-mono text-zinc-700 mt-2">Scaled preview · PDF Exports</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
