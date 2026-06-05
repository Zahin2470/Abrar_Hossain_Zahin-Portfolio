// ─────────────────────────────────────────────────────────────────
// COVER PAGE BUILDER
// Original UI preserved · Premium CoverPreview from screenshot
// ─────────────────────────────────────────────────────────────────

"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Hex background — original ────────────────────────────── */
function HexBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
        <defs>
          <pattern id="hex-cover" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 50,14 50,34 28,46 6,34 6,14"
              fill="none" stroke="#a855f7" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-cover)"/>
      </svg>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-fuchsia-700/8 rounded-full blur-3xl" />
    </div>
  );
}

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

/* ── Input helpers — original ─────────────────────────────── */
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

/* ── Diamond divider used inside the cover preview ─────────── */
const DiamondRule = () => (
  <div style={{ display:"flex", alignItems:"center", gap:8, margin:"14px 0" }}>
    <div style={{ flex:1, height:"1px", background:"linear-gradient(to right, transparent, rgba(26,58,110,0.55))" }}/>
    <span style={{ color:"#b8860b", fontSize:"9pt", lineHeight:1 }}>◆</span>
    <div style={{ flex:1, height:"1px", background:"linear-gradient(to left,  transparent, rgba(26,58,110,0.55))" }}/>
  </div>
);

/* ── Cover Page Preview — premium design ─────────────────── */
function CoverPreview({ data }) {
  return (
    <div id="ewu-cover-preview" style={{
      width:"210mm", minHeight:"297mm",
      background:"#ffffff", color:"#1a1a1a",
      fontFamily:"'Times New Roman', Times, serif",
      boxSizing:"border-box", position:"relative",
      overflow:"hidden",
    }}>

      {/* Outer border */}
      <div style={{
        position:"absolute", inset:"7mm",
        border:"1.8px solid #1a3a6e",
        borderRadius:2, pointerEvents:"none", zIndex:1,
      }}/>
      {/* Inner border */}
      <div style={{
        position:"absolute", inset:"10.5mm",
        border:"0.6px solid rgba(26,58,110,0.28)",
        borderRadius:1, pointerEvents:"none", zIndex:1,
      }}/>

      {/* Gold corner ornaments */}
      {[
        { style:{ top:"6.5mm",    left:"6.5mm"  }, rotate:"none"        },
        { style:{ top:"6.5mm",    right:"6.5mm" }, rotate:"rotate(90deg)"  },
        { style:{ bottom:"6.5mm", left:"6.5mm"  }, rotate:"rotate(-90deg)" },
        { style:{ bottom:"6.5mm", right:"6.5mm" }, rotate:"rotate(180deg)" },
      ].map(({ style: pos, rotate }, i) => (
        <div key={i} style={{ position:"absolute", width:14, height:14, pointerEvents:"none", zIndex:2, ...pos }}>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width:14, height:14, transform:rotate }}>
            <path d="M1 13 L1 1 L13 1" stroke="#b8860b" strokeWidth="1.4" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ))}

      {/* Page content */}
      <div style={{
        padding:"18mm 22mm 15mm",
        display:"flex", flexDirection:"column",
        minHeight:"297mm", boxSizing:"border-box",
        position:"relative", zIndex:3,
      }}>

        {/* University logo */}
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <img
            src="/images/profile/EWU Logo.png"
            alt="East West University"
            style={{ width:380, height:90, objectFit:"contain", display:"block", margin:"0 auto 8px" }}
          />
          <div style={{
            fontSize:"9.5pt", letterSpacing:"0.18em",
            textTransform:"uppercase", color:"#556070", marginTop:2,
          }}>
            Dhaka, Bangladesh
          </div>
        </div>

        {/* Bold double-navy rule */}
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0 12px" }}>
          <div style={{ flex:1, height:2.5, background:"#1a3a6e" }}/>
          <span style={{ color:"#b8860b", fontSize:"14pt", lineHeight:1 }}>◆</span>
          <div style={{ flex:1, height:2.5, background:"#1a3a6e" }}/>
        </div>

        {/* Department */}
        <div style={{ textAlign:"center", marginBottom:14, lineHeight:1.35 }}>
          <div style={{
            fontSize:"9.5pt", letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#b8860b",
            fontWeight:"bold", marginBottom:5,
          }}>
            Department of
          </div>
          <div style={{
            fontSize:"16pt", fontWeight:"bold",
            color:"#1a3a6e", letterSpacing:"0.02em",
          }}>
            {data.department}
          </div>
        </div>

        <DiamondRule/>

        {/* Course info table */}
        <div style={{ marginBottom:14 }}>
          <div style={{
            fontSize:"8.5pt", letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#b8860b",
            fontWeight:"bold", marginBottom:8,
          }}>
            Course Information
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11pt" }}>
            <tbody>
              {[
                ["Course Code",  data.courseCode  || "—"],
                ["Course Title", data.courseTitle  || "—"],
                ["Assignment",   data.assignment   || "—"],
                ["Section",      data.section      || "—"],
                ["Semester",     data.semester     || "—"],
              ].map(([label, val], i) => (
                <tr key={label} style={{ background: i%2===0 ? "#f8f6f2" : "#ffffff" }}>
                  <td style={{
                    padding:"6.5px 14px", border:"1px solid #c8bfb0",
                    width:"36%", fontWeight:"700", color:"#1a3a6e", fontSize:"10.5pt",
                  }}>
                    {label}
                  </td>
                  <td style={{
                    padding:"6.5px 14px", border:"1px solid #c8bfb0",
                    color: val==="—" ? "#aaa" : "#1a1a1a",
                    fontStyle: val==="—" ? "italic" : "normal",
                  }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DiamondRule/>

        {/* Submitted By */}
        <div style={{ marginBottom:14 }}>
          <div style={{
            fontSize:"8.5pt", letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#b8860b",
            fontWeight:"bold", marginBottom:8,
          }}>
            Submitted By
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11pt" }}>
            <thead>
              <tr>
                {["Student Name","Student ID"].map(h => (
                  <th key={h} style={{
                    padding:"7px 14px",
                    background:"#1a3a6e", color:"#ffffff",
                    border:"1px solid #1a3a6e",
                    textAlign:"left", fontWeight:"600",
                    fontSize:"10pt", letterSpacing:"0.06em",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.filter(s => s.name).length > 0
                ? data.students.filter(s => s.name).map((s, i) => (
                  <tr key={i} style={{ background: i%2===0 ? "#f8f6f2" : "#ffffff" }}>
                    <td style={{ padding:"6.5px 14px", border:"1px solid #c8bfb0" }}>{s.name}</td>
                    <td style={{ padding:"6.5px 14px", border:"1px solid #c8bfb0", color:"#3a4860" }}>{s.id}</td>
                  </tr>
                ))
                : (
                  <tr>
                    <td colSpan={2} style={{
                      padding:"6.5px 14px", border:"1px solid #c8bfb0",
                      color:"#aaa", textAlign:"center", fontStyle:"italic",
                    }}>
                      Enter student details →
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>

        <DiamondRule/>

        {/* Submitted To */}
        <div style={{ marginBottom:14 }}>
          <div style={{
            fontSize:"8.5pt", letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#b8860b",
            fontWeight:"bold", marginBottom:10,
          }}>
            Submitted To
          </div>
          <div style={{
            background:"#f8f6f2",
            border:"1px solid #c8bfb0",
            borderLeft:"3.5px solid #1a3a6e",
            padding:"12px 18px", lineHeight:1.75,
          }}>
            <div style={{ fontWeight:"700", fontSize:"12.5pt", color:"#1a1a1a", marginBottom:1 }}>
              {data.teacherName || "Teacher Name"}
            </div>
            <div style={{ color:"#455570", fontSize:"11pt" }}>{data.teacherDesignation || "Designation"}</div>
            <div style={{ color:"#455570", fontSize:"11pt" }}>Department of {data.department}</div>
            <div style={{ color:"#455570", fontSize:"11pt" }}>East West University</div>
          </div>
        </div>

        {/* Push footer to bottom */}
        <div style={{ flex:1 }}/>

        {/* Footer rule + date */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ flex:1, height:"1px", background:"#1a3a6e" }}/>
            <span style={{ color:"#b8860b", fontSize:"10pt", lineHeight:1 }}>◆</span>
            <div style={{ flex:1, height:"1px", background:"#1a3a6e" }}/>
          </div>
          <div style={{ textAlign:"center", fontSize:"11pt", color:"#556070", letterSpacing:"0.03em" }}>
            Date of Submission:{" "}
            <strong style={{ color:"#1a1a1a" }}>{data.submissionDate || "—"}</strong>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Main Cover Page Builder — original UI ───────────────── */
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
    <div className="relative text-white min-h-screen pt-24 pb-20 overflow-hidden" style={{ background: "transparent" }}>
      <HexBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
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
                  <div><Label>Teacher Name *</Label><Input value={data.teacherName} onChange={e => set("teacherName", e.target.value)} placeholder="Md Abrar Hossain" /></div>
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