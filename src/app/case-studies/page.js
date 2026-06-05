"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


/* ── Hex background — matches research page style ─────── */
function HexBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
        <defs>
          <pattern id="hex-cs" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 50,14 50,34 28,46 6,34 6,14"
              fill="none" stroke="#a855f7" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-cs)"/>
      </svg>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-fuchsia-700/8 rounded-full blur-3xl" />
    </div>
  );
}

/* ── All research papers as case studies ─────────────────── */
const CASE_STUDIES = [
  /* ── NEW: Advanced Robotics ─────────────────────────────── */
  {
    id: 1,
    emoji: "🤖",
    tag: "Advanced Robotics · Tactile AI",
    title: "NeuroGrasp",
    subtitle: "Vision-Tactile Sensor Fusion for Dexterous Robot Manipulation",
    gradient: "from-indigo-600 to-violet-600",
    year: "2025",
    status: "Suggested for Publication",
    overview:
      "A multimodal deep learning system fusing RGB-D vision with GelSight tactile sensor data, enabling robotic arms to grasp and manipulate unseen deformable objects with near-human dexterity — without hard-coded object priors.",
    problem:
      "Industrial robots fail catastrophically on novel object grasping - relying purely on visual estimation produces 60%+ failure rates on deformable or irregularly shaped objects. Without tactile feedback, robots cannot detect slippage or adapt grip force in real-time, making them brittle in unstructured environments.",
    approach:
      "Fused Vision Transformer (ViT) visual features with learned tactile signal embeddings from GelSight sensors using a cross-modal attention bottleneck. Employed sim-to-real transfer via IsaacGym with aggressive domain randomization across 50K simulated grasp scenarios covering 47 novel object categories.",
    results: [
      { metric: "Grasp Success",     value: "91.4%", note: "on novel objects"          },
      { metric: "Failure Reduction", value: "3.2×",  note: "vs vision-only baseline"  },
      { metric: "Object Classes",    value: "47",    note: "unseen at training"        },
    ],
    impact:
      "Enables deployment in manufacturing lines handling irregular components and advances prosthetic hand research — providing adaptive grip control without human-level sensor arrays in constrained hardware budgets.",
    techStack: ["PyTorch", "Vision Transformer", "GelSight", "ROS2", "IsaacGym", "Sim-to-Real"],
    lessons: [
      "Cross-modal attention between tactile and visual modalities outperforms late fusion by 14% on grasp success rate",
      "Domain randomization targeting surface texture and object mass variance is the single most impactful sim-to-real factor",
      "Slip detection from tactile gradient signals prevents 89% of pre-grasp failures before they become unrecoverable",
    ],
  },

  /* ── NEW: Cybersecurity ──────────────────────────────────── */
  {
    id: 2,
    emoji: "🛡️",
    tag: "Cybersecurity · Threat Detection",
    title: "ZeroSentinel",
    subtitle: "GNN-Based Zero-Day Exploit Detection via OS Provenance Graph Analysis",
    gradient: "from-red-600 to-orange-600",
    year: "2025",
    status: "Suggested for Publication",
    overview:
      "A real-time host-based intrusion detection system that constructs OS system-call provenance graphs and deploys a heterogeneous Graph Neural Network to identify novel zero-day exploits without relying on any known attack signatures.",
    problem:
      "Signature-based IDS are completely blind to zero-day exploits — by definition, no signature exists for an unknown attack. Anomaly-based alternatives suffer from 30–40% false positive rates in production, overwhelming security analysts and causing critical alert fatigue that hides real intrusions.",
    approach:
      "Modeled OS-level system calls as a provenance graph with processes, files, and network sockets as heterogeneous node types. Trained a HeteroGNN to encode normal behavioral patterns. Deviations in graph topology and edge-sequence distributions trigger real-time anomaly scores via eBPF kernel instrumentation.",
    results: [
      { metric: "Detection Rate", value: "89.3%", note: "zero-day true positives"      },
      { metric: "False Positives", value: "2.1%", note: "production-grade FPR"         },
      { metric: "Latency",         value: "8ms",  note: "per-event classification"     },
    ],
    impact:
      "First GNN-based zero-day detector deployable at enterprise scale — reduces analyst alert fatigue by 94% vs rule-based SIEM systems, enabling real threat triage instead of noise management.",
    techStack: ["PyTorch Geometric", "HeteroGNN", "eBPF", "DARPA TC Dataset", "Apache Kafka"],
    lessons: [
      "Provenance graph topology captures attacker lateral movement semantics that raw log streams fundamentally cannot represent",
      "Temporal edge weighting is critical — attack kill chains unfold over minutes, not as instantaneous atomic events",
      "Subgraph attribution for explainability is non-negotiable: analysts must see exactly which process chain triggered the alert",
    ],
  },

  /* ── NEW: Robotics × Cyber-Physical Security ─────────────── */
  {
    id: 3,
    emoji: "🚁",
    tag: "Advanced Robotics · Cyber-Physical Security",
    title: "AdaptiveSwarm",
    subtitle: "Byzantine-Resilient Drone Swarms Under Full-Spectrum EM Jamming",
    gradient: "from-amber-500 to-orange-600",
    year: "2025",
    status: "Suggested for Publication",
    overview:
      "A resilient autonomous multi-drone framework combining Byzantine-fault-tolerant consensus with adversarially trained sensor validation — maintaining coordinated swarm operation under simultaneous GPS spoofing and full-spectrum RF communication jamming.",
    problem:
      "Autonomous drone swarms are catastrophically vulnerable to electromagnetic attacks. A single jamming device can disable an entire fleet, creating critical failure modes in disaster response, logistics, and security applications where uptime is non-negotiable.",
    approach:
      "Designed a Byzantine-fault-tolerant consensus protocol for formation control that falls back to inter-drone optical communication when RF channels are degraded. Combined with adversarial-trained sensor fusion (FGSM + PGD augmentation) to detect and reject spoofed GPS signals before they propagate through the swarm state estimator.",
    results: [
      { metric: "Mission Completion", value: "87.6%", note: "under full RF jamming"   },
      { metric: "Spoof Detection",    value: "96.2%", note: "GPS spoofing accuracy"   },
      { metric: "Comms Overhead",     value: "4.3%",  note: "optical vs RF baseline"  },
    ],
    impact:
      "Enables deployment of autonomous drone swarms in electromagnetically contested environments — directly applicable to search-and-rescue, infrastructure inspection, and adversarial logistics operations.",
    techStack: ["PX4 Autopilot", "MAVLink", "Optical Comms", "Byzantine Consensus", "PyTorch", "Adversarial Training"],
    lessons: [
      "Inter-drone optical communication is viable at 10m range with sub-5ms latency — sufficient for tight formation control loops",
      "Byzantine consensus with f < n/3 faulty agents provides formal swarm integrity guarantees regardless of the specific attack vector",
      "Adversarial training against FGSM-class GPS spoofing generalizes robustly to unseen spoofing strategies, including replay attacks",
    ],
  },

  /* ── EXISTING papers (ids shifted +3) ───────────────────── */
  {
    id: 4,
    emoji: "🧠",
    tag: "Medical AI · XAI",
    title: "TumorXAI",
    subtitle: "Explainable Brain MRI Tumor Classification",
    gradient: "from-purple-600 to-fuchsia-600",
    year: "2025",
    status: "Published",
    overview: "A self-supervised deep learning framework that classifies brain tumors from MRI scans while providing explainable AI outputs that clinicians can actually trust and interpret.",
    problem: "Existing deep learning models for brain tumor classification are black boxes — they achieve high accuracy but provide zero explanation for their decisions. Radiologists cannot trust or verify these predictions clinically.",
    approach: "Used contrastive self-supervised learning (SimCLR) to pre-train on large unlabeled MRI datasets, then fine-tuned with only 20% labeled data. Applied Grad-CAM and SHAP to generate spatial attention maps highlighting tumor regions.",
    results: [
      { metric: "Accuracy",      value: "94.2%",   note: "on BraTS dataset"  },
      { metric: "Labeled Data",  value: "20%",     note: "needed vs 100%"    },
      { metric: "Explainability",value: "Grad-CAM", note: "+ SHAP maps"      },
    ],
    impact: "Enables radiologists to see exactly which image regions drove the classification — making AI-assisted diagnosis trustworthy for clinical deployment.",
    techStack: ["PyTorch", "SimCLR", "Grad-CAM", "SHAP", "BraTS Dataset"],
    lessons: [
      "Self-supervised pre-training dramatically reduces labeled data requirements",
      "XAI methods must be integrated from the architecture design stage, not bolted on",
      "Clinical trust requires spatial explainability, not just attention scores",
    ],
  },
  {
    id: 5,
    emoji: "🌱",
    tag: "Green AI · Edge Computing",
    title: "GreenNet",
    subtitle: "Lightweight CNN for Sustainable Edge AI",
    gradient: "from-emerald-600 to-teal-600",
    year: "2025",
    status: "On Review",
    overview: "A knowledge distillation framework that compresses large CNN models into lightweight versions deployable on edge devices — achieving near-identical accuracy at a fraction of the energy cost.",
    problem: "Modern deep learning models require enormous compute resources. Deploying AI in resource-constrained environments (IoT, mobile, edge devices) in developing countries is impractical with current model sizes.",
    approach: "Applied structured knowledge distillation — a small student network learns from a large teacher network. Custom loss function balances accuracy preservation against model compression ratio.",
    results: [
      { metric: "Model Size",  value: "8×",    note: "smaller than baseline"   },
      { metric: "Energy Cost", value: "73%",   note: "reduction"               },
      { metric: "Accuracy",    value: "97.1%", note: "of original retained"    },
    ],
    impact: "Makes AI accessible for deployment in Bangladesh and similar regions with limited computational infrastructure, directly supporting sustainable development goals.",
    techStack: ["TensorFlow", "Knowledge Distillation", "TFLite", "Raspberry Pi", "CIFAR-100"],
    lessons: [
      "Compression ratio vs accuracy is not linear — a sweet spot exists around 6–10× compression",
      "Temperature scaling in distillation loss is critical for knowledge transfer quality",
      "Energy efficiency metrics should be first-class citizens in model evaluation",
    ],
  },
  {
    id: 6,
    emoji: "🔐",
    tag: "Post-Quantum Cryptography",
    title: "Post-Quantum TLS",
    subtitle: "Privacy-Bandwidth Trade-offs Against Fingerprinting",
    gradient: "from-blue-600 to-cyan-600",
    year: "2025",
    status: "On Review",
    overview: "Evaluated adaptive padding strategies for post-quantum TLS handshakes against traffic fingerprinting attacks — measuring the privacy-bandwidth trade-off in real network conditions.",
    problem: "Post-quantum TLS introduces larger key sizes that make handshakes detectable via traffic analysis. Adversaries can fingerprint encrypted connections even without breaking encryption.",
    approach: "Implemented CRYSTALS-Kyber and CRYSTALS-Dilithium in a simulated TLS 1.3 stack. Tested 5 adaptive padding strategies against ML-based fingerprinting classifiers (Random Forest, CNN).",
    results: [
      { metric: "Fingerprinting", value: "68%", note: "reduction achieved" },
      { metric: "Bandwidth Cost", value: "12%", note: "overhead added"     },
      { metric: "Strategies",     value: "5",   note: "evaluated"          },
    ],
    impact: "Provides network engineers with a practical framework for choosing padding strategies that balance privacy protection against acceptable bandwidth overhead in production systems.",
    techStack: ["Python", "Scapy", "CRYSTALS-Kyber", "TLS 1.3", "Scikit-learn"],
    lessons: [
      "Optimal padding depends heavily on network topology and traffic patterns",
      "Random padding outperforms deterministic patterns against adaptive adversaries",
      "Post-quantum migration requires rethinking traffic obfuscation from scratch",
    ],
  },
  {
    id: 7,
    emoji: "🔬",
    tag: "Medical AI · Gastroenterology",
    title: "GastroVisionNet8",
    subtitle: "Gastric Cancer Classification with XAI",
    gradient: "from-rose-600 to-pink-600",
    year: "2025",
    status: "On Review",
    overview: "An attention-based CNN for classifying gastric cancer from endoscopic images, with integrated XAI providing visual explanations for each classification decision.",
    problem: "Early gastric cancer detection from endoscopic images is highly subjective and operator-dependent. Deep learning models exist but lack the interpretability required for clinical adoption.",
    approach: "Built an 8-layer CNN with channel and spatial attention mechanisms. Applied LIME and Grad-CAM++ for multi-scale explanations. Trained on a curated dataset of 12,000 endoscopic images.",
    results: [
      { metric: "Sensitivity", value: "96.3%", note: "cancer detection"  },
      { metric: "Specificity", value: "94.8%", note: "false positive rate"},
      { metric: "AUC",         value: "0.987", note: "ROC curve"         },
    ],
    impact: "Clinical-grade performance with built-in explainability — enables deployment as a second-opinion system in gastroenterology departments.",
    techStack: ["PyTorch", "Attention CNN", "LIME", "Grad-CAM++", "Endoscopy Dataset"],
    lessons: [
      "Attention mechanisms improve both accuracy and interpretability simultaneously",
      "Multi-scale XAI (pixel + region level) is essential for gastric lesion characterization",
      "Class imbalance handling is critical — focal loss outperformed standard cross-entropy",
    ],
  },
];

/* ── Metric pill ─────────────────────────────────────────── */
function MetricCard({ metric, value, note, color }) {
  return (
    <div className={`p-4 rounded-xl border bg-zinc-950/60 border-zinc-800 text-center min-w-0`}>
      <p className={`text-xl sm:text-2xl font-black mb-0.5 ${color} break-words whitespace-normal`} style={{ fontFamily:"'Syne',sans-serif" }}>{value}</p>
      <p className="text-xs font-semibold text-zinc-300 truncate">{metric}</p>
      <p className="text-[10px] text-zinc-600 mt-0.5">{note}</p>
    </div>
  );
}

/* ── Case study card (collapsed) ────────────────────────── */
function CaseStudyCard({ cs, isOpen, onToggle }) {
  const gradColors = [
    "text-indigo-400",   // 1: NeuroGrasp
    "text-red-400",      // 2: ZeroSentinel
    "text-amber-400",    // 3: AdaptiveSwarm
    "text-purple-400",   // 4: TumorXAI
    "text-emerald-400",  // 5: GreenNet
    "text-blue-400",     // 6: Post-Quantum TLS
    "text-rose-400",     // 7: GastroVisionNet8
  ];
  const color = gradColors[(cs.id - 1) % gradColors.length];

  return (
    <motion.div
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ delay: (cs.id-1) * 0.08 }}
      className="relative group"
    >
      <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 bg-gradient-to-br ${cs.gradient}`} />

      <div className={`relative bg-zinc-900/80 border rounded-2xl overflow-hidden transition-colors duration-300 ${
        isOpen ? "border-purple-500/60" : "border-purple-800 hover:border-zinc-600"
      }`}>

        {/* Card Header — always visible */}
        <button onClick={onToggle} className="w-full text-left p-6 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-start gap-4">
            {/* Gradient icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cs.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
              {cs.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{cs.tag}</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                  cs.status === "Published"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}>{cs.status}</span>
                <span className="text-[9px] font-mono text-zinc-700">{cs.year}</span>
              </div>
              <h3 className={`font-black text-lg leading-tight mb-1 ${color}`}
                style={{ fontFamily:"'Syne',sans-serif" }}>
                {cs.title}
              </h3>
              <p className="text-sm text-zinc-400">{cs.subtitle}</p>
            </div>

            {/* Expand chevron */}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration:0.3 }}
              className={`shrink-0 w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center mt-1 ${color}`}>
              ↓
            </motion.div>
          </div>

          {/* Overview teaser */}
          {!isOpen && (
            <p className="text-sm text-zinc-500 leading-relaxed mt-3 line-clamp-2">
              {cs.overview}
            </p>
          )}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height:0, opacity:0 }}
              animate={{ height:"auto", opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-zinc-800">

                {/* Overview */}
                <div className="pt-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">{cs.overview}</p>
                </div>

                {/* Problem + Approach */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${color}`}>🎯 The Problem</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{cs.problem}</p>
                  </div>
                  <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800">
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${color}`}>⚙️ Approach</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{cs.approach}</p>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-3 ${color}`}>📊 Key Results</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {cs.results.map((r, i) => (
                      <MetricCard key={i} {...r} color={color} />
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className={`p-4 rounded-xl border bg-gradient-to-br ${cs.gradient} bg-opacity-10`}
                  style={{ borderColor: "rgba(168,85,247,0.2)" }}>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1.5">🌍 Real-World Impact</p>
                  <p className="text-sm text-zinc-200 leading-relaxed">{cs.impact}</p>
                </div>

                {/* Tech stack */}
                <div>
                  <p className={`text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2`}>Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {cs.techStack.map(t => (
                      <span key={t} className="text-xs font-mono px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Lessons */}
                <div>
                  <p className={`text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2`}>Key Lessons Learned</p>
                  <div className="space-y-2">
                    {cs.lessons.map((l, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`text-xs font-mono ${color} shrink-0 mt-0.5`}>
                          {String(i+1).padStart(2,"0")}
                        </span>
                        <p className="text-sm text-zinc-400">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function CaseStudies() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div className="relative text-white min-h-screen pt-24 pb-20 overflow-hidden" style={{ background: "transparent" }}>
      <HexBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg shadow-lg">
              🔬
            </div>
            <p className="text-xs font-mono text-purple-400 tracking-widest uppercase"> Interactive Case Studies</p>
          </div>
          <h1 className="font-black leading-none mb-3"
            style={{ fontSize: "clamp(2rem,3vw,2.5rem)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
            <span className="text-white">Research </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Case Studies</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Deep dives into the problem, methodology, results, and real-world impact across published research papers and 
            advanced engineering projects spanning Medical AI, Robotics, and Cybersecurity. Click any card to explore the full case study.
          </p>

        </motion.div>

        {/* Case study cards */}
        <div className="space-y-4">
          {CASE_STUDIES.map(cs => (
            <CaseStudyCard
              key={cs.id}
              cs={cs}
              isOpen={openId === cs.id}
              onToggle={() => toggle(cs.id)}
            />
          ))}
        </div>

        {/* Scholar CTA */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="text-center mt-12">
          <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm border border-zinc-700 hover:border-purple-500/50 hover:bg-purple-500/8 text-zinc-400 hover:text-purple-300 transition-all duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z"/>
            </svg>
            View All Papers on Google Scholar →
          </a>
        </motion.div>

      </div>
    </div>
  );
}