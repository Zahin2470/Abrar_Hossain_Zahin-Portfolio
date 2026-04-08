import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Head>
        <title>Abrar Hossain Zahin | AI & ML Engineer</title>
      </Head>

      <div className="bg-zinc-500 text-white min-h-screen font-sans">

      {/* Premium Navbar with better animation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Zahin
          </motion.div>

          <div className="flex gap-8 text-sm uppercase tracking-widest font-medium">
            {[
              { name: "About Me", id: "about" },
              { name: "Skills", id: "skills" },
              { name: "Projects", id: "projects" },
              { name: "Research", id: "research" },
              { name: "Connect", id: "connect" }
            ].map((item, index) => (
              <motion.a 
                key={item.id}
                href={`#${item.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ 
                  color: "#c084fc", 
                  scale: 1.05,
                  textShadow: "0 0 8px rgba(192, 132, 252, 0.5)"
                }}
                className="hover:text-purple-400 transition-all duration-300"
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </div>
      </nav>

        {/* Hero Section - More Attractive */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 z-0"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 max-w-6xl mx-auto px-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              className="w-56 h-56 mx-auto mb-10 rounded-full overflow-hidden border-8 border-purple-500 shadow-2xl ring-4 ring-purple-500/30"
            >
              <img 
                src="/images/profile/developer-pic-1.png" 
                alt="Abrar Hossain Zahin"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">Abrar Hossain Zahin</h1>
            <p className="text-4xl text-purple-400 mb-8">Aspiring AI &amp; ML Engineer</p>
            <p className="max-w-2xl mx-auto text-lg text-zinc-300 leading-relaxed">
              B.Sc. Computer Science and Engineering Student at East West University, Dhaka.<br />
              Passionate about Machine Learning, Deep Learning, NLP, LLMs &amp; Computer Vision.
            </p>
          </motion.div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-24 border-t border-zinc-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold mb-10">About Me</h2>
            <p className="text-xl text-zinc-300 leading-relaxed">
              I am a passionate Data Analyst and AI/ML enthusiast currently pursuing B.Sc. in Computer Science and Engineering at East West University. 
              I enjoy building intelligent systems that solve real-world problems, especially in healthcare, environment, and education.
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="py-24 bg-zinc-700 border-t border-zinc-600" id="skills">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-16">Skills &amp; Technologies</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {["Python", "TensorFlow", "PyTorch", "TypeScript", "React", "Next.js", "Tailwind", "Pandas", "OpenCV", "Docker", "Git", "Jupyter"].map((skill, i) => (
                <motion.div key={skill} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.1 }} className="bg-zinc-550 p-8 rounded-3xl text-center text-purple-200 font-medium hover:bg-purple-600 transition-all">
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - 6 Beautiful Cards */}
        <section id="projects" className="py-14">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-16">Featured Projects</h2>
            
            <div className="grid md:grid-cols-2 gap-10">

              {/* 1. ElderCare-SuperApp */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🧓</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">ElderCare-SuperApp</h3>
                  <p className="text-zinc-400 mt-2">Unified elderly care platform for Bangladesh (TypeScript)</p>
                  <a href="https://github.com/Zahin2470/ElderCare-SuperApp" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

              {/* 2. Job-Portal */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">💼</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">Job-Portal</h3>
                  <p className="text-zinc-400 mt-2">Full-stack job search and management system</p>
                  <a href="https://github.com/Zahin2470/Job-Portal" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

              {/* 3. Green-Browsing-Tracker */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🌍</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">Green-Browsing-Tracker</h3>
                  <p className="text-zinc-400 mt-2">Chrome extension that tracks browsing energy & carbon footprint with dashboard</p>
                  <a href="https://github.com/Zahin2470/Green-Browsing-Tracker" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

              {/* 4. Blood-Donation-Management-Software */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🩸</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">Blood-Donation-Management-Software</h3>
                  <p className="text-zinc-400 mt-2">Full-stack blood donation management platform for Bangladesh</p>
                  <a href="https://github.com/Zahin2470/Blood-Donation-Management-Software" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

              {/* 5. Multiplication-Game - New */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🎮</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">Multiplication-Game</h3>
                  <p className="text-zinc-400 mt-2">Interactive and fun multiplication learning game</p>
                  <a href="https://github.com/Zahin2470/Multiplication-Game" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

              {/* 6. Chat-Application - New */}
              <motion.div whileHover={{ y: -15 }} className="group bg-zinc-900 rounded-3xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">💬</div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold">Chat-Application</h3>
                  <p className="text-zinc-400 mt-2">Real-time messaging application with modern UI</p>
                  <a href="https://github.com/Zahin2470/Chat-Application" target="_blank" className="text-purple-400 mt-6 inline-block hover:underline">View Project →</a>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Research Papers Section - Attractive & Professional */}
        <section id="research" className="py-24 bg-zinc-900 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-center mb-16"
            >
              Research Papers & Publications
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Paper 1 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-850 rounded-3xl p-8 hover:bg-zinc-750 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-xl">📄</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  Privacy-Bandwidth Trade-offs in Post-Quantum TLS: Evaluating Adaptive Padding Strategies Against Handshake Fingerprinting
                </h3>
                <p className="text-zinc-400 text-sm">Focus: Post-Quantum Cryptography, TLS Security, Fingerprinting Resistance</p>
              </motion.div>

              {/* Paper 2 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-xl">🧠</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  TumorXAI: Self-Supervised Deep Learning Framework for Explainable Brain MRI Tumor Classification
                </h3>
                <p className="text-zinc-400 text-sm">Focus: Medical Imaging, XAI, Self-Supervised Learning</p>
              </motion.div>

              {/* Paper 3 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-xl">🌱</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  GreenNet: A Lightweight CNN with Knowledge Distillation for Sustainable Edge AI - A Green Score Benchmarking Study on MNIST and CIFAR-10
                </h3>
                <p className="text-zinc-400 text-sm">Focus: Green AI, Knowledge Distillation, Edge Computing</p>
              </motion.div>

              {/* Paper 4 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center text-xl">🩺</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  GastroVisionNet8: An Attention-Based CNN for Gastric Cancer Classification with XAI
                </h3>
                <p className="text-zinc-400 text-sm">Focus: Medical AI, Attention Mechanism, Explainable AI</p>
              </motion.div>

              {/* Paper 5 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-xl">🎥</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  SentiVec: Sentiment-Aware Vector-based Movie Review Retrieval System
                </h3>
                <p className="text-zinc-400 text-sm">Focus: NLP, Sentiment Analysis, Vector Retrieval</p>
              </motion.div>

              {/* Paper 6 */}
              <motion.div 
                whileHover={{ y: -12 }}
                className="bg-zinc-800 rounded-3xl p-8 hover:bg-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-500 rounded-2xl flex items-center justify-center text-xl">🌴</div>
                  <span className="text-purple-400 text-sm font-medium">RESEARCH PAPER</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight mb-4 group-hover:text-purple-400 transition-colors">
                  Date Palm Tree monitoring in Drone Imagery Using a Self-Supervised BYOL-Driven YOLOv12s Backbone
                </h3>
                <p className="text-zinc-400 text-sm">Focus: Computer Vision, Self-Supervised Learning, YOLO, Drone Imagery</p>
              </motion.div>

            </div>

            <div className="text-center mt-12">
              <a 
                href="https://scholar.google.com/citations?user=PggflFIAAAAJ" 
                target="_blank"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                View All on Google Scholar →
              </a>
            </div>
          </div>
        </section>

        {/* Connect Section - Fixed with proper ID */}
        <section id="connect" className="py-10 bg-zinc-350 border-t border-zinc-800 text-center">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-12"
            >
              Connect With Me
            </motion.h2>
            
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 text-lg font-medium">
              <a href="https://linkedin.com/in/md-abrar-hossain-zahin" target="_blank" className="hover:text-purple-400 transition-colors">LinkedIn</a>
              <a href="https://kaggle.com/mdabrarhossainzahin" target="_blank" className="hover:text-purple-400 transition-colors">Kaggle</a>
              <a href="https://facebook.com/AbrarHossainZahin" target="_blank" className="hover:text-purple-400 transition-colors">Facebook</a>
              <a href="https://researchgate.net/profile/Abrar-Zahin-7" target="_blank" className="hover:text-purple-400 transition-colors">ResearchGate</a>
              <a href="https://scholar.google.com/citations?user=PggflFIAAAAJ" target="_blank" className="hover:text-purple-400 transition-colors">Google Scholar</a>
              <a href="https://leetcode.com/u/MdZahin" target="_blank" className="hover:text-purple-400 transition-colors">LeetCode</a>
              <a href="https://codeforces.com/profile/MD.Zahin" target="_blank" className="hover:text-purple-400 transition-colors">CodeForces</a>
              <a href="https://www.youtube.com/@Abrar_Hossain_Zahin" target="_blank" className="hover:text-purple-400 transition-colors">YouTube</a>
            </div>

            <p className="mt-16 text-zinc-450 text-sm">
              Open to collaborations, research opportunities, and exciting AI/ML projects.
            </p>
          </div>
        </section>

        <footer className="py-12 text-center text-zinc-900 text-sm">
          © 2026 Abrar Hossain Zahin
        </footer>
      </div>
    </>
  );
}