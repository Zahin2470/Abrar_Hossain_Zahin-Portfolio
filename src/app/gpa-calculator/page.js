"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── EWU Grade Scale ─────────────────────────────────────── */
const GRADE_SCALE = [
  { grade: "A+",  min: 80, max: 100, points: 4.00 },
  { grade: "A",   min: 75, max: 79,  points: 3.75 },
  { grade: "A-",  min: 70, max: 74,  points: 3.50 },
  { grade: "B+",  min: 65, max: 69,  points: 3.25 },
  { grade: "B",   min: 60, max: 64,  points: 3.00 },
  { grade: "B-",  min: 55, max: 59,  points: 2.75 },
  { grade: "C+",  min: 50, max: 54,  points: 2.50 },
  { grade: "C",   min: 45, max: 49,  points: 2.25 },
  { grade: "D",   min: 40, max: 44,  points: 2.00 },
  { grade: "F",   min: 0,  max: 39,  points: 0.00 },
];

const getGradeInfo = (marks) => {
  const m = parseFloat(marks);
  if (isNaN(m)) return null;
  return GRADE_SCALE.find(g => m >= g.min && m <= g.max) || GRADE_SCALE[GRADE_SCALE.length - 1];
};

const getGradeColor = (grade) => {
  if (!grade) return "text-zinc-500";
  if (["A+","A","A-"].includes(grade)) return "text-emerald-400";
  if (["B+","B","B-"].includes(grade)) return "text-blue-400";
  if (["C+","C"].includes(grade))      return "text-amber-400";
  if (grade === "D")                    return "text-orange-400";
  return "text-red-400";
};

const EMPTY_COURSE = { name: "", credits: "3", marks: "", grade: "" };

const Label = ({ children }) => (
  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{children}</label>
);
const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    className={`w-full bg-zinc-900/80 border border-zinc-800 focus:border-purple-500/60 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors ${className}`} />
);

/* ── GPA Meter ───────────────────────────────────────────── */
function GPAMeter({ gpa, label = "Current GPA" }) {
  const pct  = (gpa / 4.0) * 100;
  const color = gpa >= 3.5 ? "#34d399" : gpa >= 3.0 ? "#60a5fa" : gpa >= 2.5 ? "#fbbf24" : "#f87171";
  return (
    <div className="text-center">
      <div className="relative w-36 h-36 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="52" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color, fontFamily: "'Syne',sans-serif" }}>
            {gpa.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">/ 4.00</span>
        </div>
      </div>
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function GPACalculator() {
  const [tab, setTab]       = useState("current");  // "current" | "target" | "cgpa"
  const [courses, setCourses] = useState([
    { ...EMPTY_COURSE, name: "Data Structures", credits: "3" },
    { ...EMPTY_COURSE, name: "Algorithms", credits: "3" },
    { ...EMPTY_COURSE },
  ]);

  // CGPA tab state
  const [prevCGPA,   setPrevCGPA]   = useState("");
  const [prevCredits,setPrevCredits]= useState("");

  // Target grade tab state
  const [targetGPA,     setTargetGPA]     = useState("3.50");
  const [targetCourses, setTargetCourses] = useState([
    { name: "Course 1", credits: "3", currentMarks: "" },
    { name: "Course 2", credits: "3", currentMarks: "" },
  ]);

  /* ── Current GPA calc ──────────────────────────────────── */
  const { currentGPA, totalCredits, earnedPoints } = useMemo(() => {
    let pts = 0, creds = 0;
    courses.forEach(c => {
      const cr = parseFloat(c.credits);
      const gi = c.marks ? getGradeInfo(c.marks) : c.grade ? GRADE_SCALE.find(g => g.grade === c.grade) : null;
      if (gi && cr > 0) { pts += gi.points * cr; creds += cr; }
    });
    return { currentGPA: creds ? pts / creds : 0, totalCredits: creds, earnedPoints: pts };
  }, [courses]);

  /* ── CGPA calc ─────────────────────────────────────────── */
  const cgpa = useMemo(() => {
    const prevP = parseFloat(prevCGPA)   || 0;
    const prevC = parseFloat(prevCredits)|| 0;
    if (!prevP || !prevC || !totalCredits) return 0;
    return (prevP * prevC + earnedPoints) / (prevC + totalCredits);
  }, [prevCGPA, prevCredits, earnedPoints, totalCredits]);

  const setCourse  = (i, field, val) =>
    setCourses(cs => cs.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  const addCourse  = () => setCourses(cs => [...cs, { ...EMPTY_COURSE }]);
  const delCourse  = (i) => setCourses(cs => cs.filter((_, idx) => idx !== i));

  const setTC = (i, field, val) =>
    setTargetCourses(cs => cs.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  const addTC = () => setTargetCourses(cs => [...cs, { name: `Course ${cs.length+1}`, credits: "3", currentMarks: "" }]);
  const delTC = (i) => setTargetCourses(cs => cs.filter((_, idx) => idx !== i));

  /* ── Needed marks to hit target ──────────────────────────── */
  const neededMarks = useMemo(() => {
    const tgt = parseFloat(targetGPA) || 0;
    return targetCourses.map(c => {
      const cr  = parseFloat(c.credits) || 3;
      const cur = parseFloat(c.currentMarks);
      // If current marks given, what grade needed in remaining courses?
      const needed = tgt * cr;
      const closest = GRADE_SCALE.slice().reverse().find(g => g.points * cr >= needed * 0.8);
      return { ...c, needed: closest?.grade || "A+", minMarks: closest?.min || 90 };
    });
  }, [targetGPA, targetCourses]);

  const TABS = [
    { id: "current", label: "GPA Calculator" },
    { id: "target",  label: "Target Grades"  },
    { id: "cgpa",    label: "CGPA Tracker"   },
  ];

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen pt-24 pb-20" style={{ overflowX:"hidden" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage:"linear-gradient(to right,#a855f7 1px,transparent 1px),linear-gradient(to bottom,#a855f7 1px,transparent 1px)", backgroundSize:"72px 72px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3">Academic Calculator</p>
          <h1 className="font-black leading-none mb-2"
            style={{ fontSize:"clamp(2rem,3vw,3rem)", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.03em" }}>
            <span className="text-white">GPA & Grade </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Calculator</span>
          </h1>
          <p className="text-zinc-500 text-sm">East West University and Others Standard Grading Scale · Calculate GPA, CGPA, and Target Marks</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-1.5 mb-6 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                tab === t.id ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}>
              {t.id === tab && "▸ "}{t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── TAB: Current GPA ── */}
          {tab === "current" && (
            <motion.div key="current"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
              className="grid lg:grid-cols-3 gap-6">

              {/* Course table */}
              <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Add Your Courses</p>

                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-5 text-[10px] font-mono text-zinc-700 uppercase">Course Name</div>
                  <div className="col-span-2 text-[10px] font-mono text-zinc-700 uppercase">Credits</div>
                  <div className="col-span-3 text-[10px] font-mono text-zinc-700 uppercase">Marks / 100</div>
                  <div className="col-span-2 text-[10px] font-mono text-zinc-700 uppercase">Grade</div>
                </div>

                <div className="space-y-2">
                  {courses.map((c, i) => {
                    const gi = c.marks ? getGradeInfo(c.marks) : null;
                    return (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center group">
                        <div className="col-span-5">
                          <Input value={c.name} onChange={e => setCourse(i,"name",e.target.value)} placeholder={`Course ${i+1}`} />
                        </div>
                        <div className="col-span-2">
                          <Input type="number" value={c.credits} onChange={e => setCourse(i,"credits",e.target.value)} placeholder="3" />
                        </div>
                        <div className="col-span-3">
                          <Input type="number" value={c.marks} onChange={e => setCourse(i,"marks",e.target.value)} placeholder="85" />
                        </div>
                        <div className={`col-span-1 text-sm font-bold text-center ${getGradeColor(gi?.grade)}`}>
                          {gi?.grade || "—"}
                        </div>
                        <button onClick={() => delCourse(i)}
                          className="col-span-1 text-zinc-700 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                    );
                  })}
                </div>

                <button onClick={addCourse}
                  className="mt-4 text-xs font-mono text-zinc-600 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all">
                  + Add Course
                </button>
              </div>

              {/* GPA result */}
              <div className="space-y-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <GPAMeter gpa={currentGPA} />
                  <div className="mt-4 space-y-2">
                    {[
                      { label:"Total Credits", val: totalCredits.toFixed(0) },
                      { label:"Grade Points",  val: earnedPoints.toFixed(2) },
                    ].map(s => (
                      <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-zinc-800">
                        <span className="text-xs font-mono text-zinc-600">{s.label}</span>
                        <span className="text-sm font-bold text-zinc-200">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grade scale reference */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">EWU & Others Grade Scale</p>
                  <div className="space-y-1">
                    {GRADE_SCALE.map(g => (
                      <div key={g.grade} className="flex justify-between text-xs">
                        <span className={`font-bold w-8 ${getGradeColor(g.grade)}`}>{g.grade}</span>
                        <span className="text-zinc-600">{g.min}–{g.max}</span>
                        <span className="text-zinc-500 font-mono">{g.points.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB: Target Grades ── */}
          {tab === "target" && (
            <motion.div key="target"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
              className="grid lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <Label>Target Semester GPA</Label>
                    <Input type="number" value={targetGPA}
                      onChange={e => setTargetGPA(e.target.value)} placeholder="3.50"
                      className="w-32" />
                  </div>
                </div>

                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Your Courses This Semester</p>
                <div className="space-y-2">
                  {targetCourses.map((c, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-5">
                        <Input value={c.name} onChange={e => setTC(i,"name",e.target.value)} placeholder={`Course ${i+1}`} />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" value={c.credits} onChange={e => setTC(i,"credits",e.target.value)} placeholder="3" />
                      </div>
                      <div className="col-span-3">
                        <Input type="number" value={c.currentMarks} onChange={e => setTC(i,"currentMarks",e.target.value)} placeholder="Current %" />
                      </div>
                      <button onClick={() => delTC(i)}
                        className="col-span-2 text-zinc-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-colors">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={addTC}
                  className="mt-4 text-xs font-mono text-zinc-600 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all">
                  + Add Course
                </button>
              </div>

              {/* Needed grades */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
                  Minimum Grades Needed for {targetGPA} GPA
                </p>
                <div className="space-y-3">
                  {neededMarks.map((c, i) => (
                    <div key={i} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-300 mb-1 truncate">{c.name || `Course ${i+1}`}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${getGradeColor(c.needed)}`}
                          style={{ fontFamily:"'Syne',sans-serif" }}>{c.needed}</span>
                        <span className="text-xs text-zinc-600">≥ {c.minMarks} marks</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-zinc-700 mt-4">Based on EWU & Others Grading Scale</p>
              </div>
            </motion.div>
          )}

          {/* ── TAB: CGPA Tracker ── */}
          {tab === "cgpa" && (
            <motion.div key="cgpa"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
              className="grid lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Previous Academic Record</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Previous CGPA</Label>
                      <Input type="number" value={prevCGPA} onChange={e => setPrevCGPA(e.target.value)} placeholder="3.25" />
                    </div>
                    <div>
                      <Label>Total Credits Completed</Label>
                      <Input type="number" value={prevCredits} onChange={e => setPrevCredits(e.target.value)} placeholder="90" />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
                    Current Semester Courses (use GPA tab)
                  </p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">📊</div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">Semester GPA: <span className="text-emerald-400">{currentGPA.toFixed(2)}</span></p>
                      <p className="text-xs text-zinc-600">{totalCredits} credits · {courses.filter(c=>c.marks||c.grade).length} courses entered</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-700 mt-2">← Enter marks in the GPA Calculator tab to update this</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                  <GPAMeter gpa={cgpa || currentGPA} label="Projected CGPA" />
                  <div className="mt-4 space-y-2">
                    {[
                      { label:"Previous CGPA",  val: parseFloat(prevCGPA)||0, fmt: v => v.toFixed(2) },
                      { label:"Semester GPA",   val: currentGPA,              fmt: v => v.toFixed(2) },
                      { label:"New Total Creds",val: (parseFloat(prevCredits)||0)+totalCredits, fmt: v => v.toFixed(0) },
                    ].map(s => (
                      <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-zinc-800">
                        <span className="text-xs font-mono text-zinc-600">{s.label}</span>
                        <span className="text-sm font-bold text-zinc-200">{s.fmt(s.val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-mono text-zinc-600 mb-2">Classification</p>
                  <p className={`text-lg font-black ${getGradeColor(cgpa >= 3.75 ? "A+" : cgpa >= 3.50 ? "A" : cgpa >= 3.00 ? "B+" : cgpa >= 2.75 ? "B" : "C")}`}
                    style={{ fontFamily:"'Syne',sans-serif" }}>
                    {cgpa >= 3.75 ? "Summa Cum Laude" : cgpa >= 3.50 ? "Magna Cum Laude" : cgpa >= 3.00 ? "Cum Laude" : cgpa >= 2.00 ? "Good Standing" : "—"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
