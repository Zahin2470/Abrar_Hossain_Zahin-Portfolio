<div align="center">

<br/>

```
 █████╗ ██████╗ ██████╗  █████╗ ██████╗     ██╗  ██╗ ██████╗ ███████╗███████╗ █████╗ ██╗███╗   ██╗    ███████╗ █████╗ ██╗  ██╗██╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗    ██║  ██║██╔═══██╗██╔════╝██╔════╝██╔══██╗██║████╗  ██║    ╚══███╔╝██╔══██╗██║  ██║██║████╗  ██║
███████║██████╔╝██████╔╝███████║██████╔╝    ███████║██║   ██║███████╗███████╗███████║██║██╔██╗ ██║      ███╔╝ ███████║███████║██║██╔██╗ ██║
██╔══██║██╔══██╗██╔══██╗██╔══██║██╔══██╗    ██╔══██║██║   ██║╚════██║╚════██║██╔══██║██║██║╚██╗██║     ███╔╝  ██╔══██║██╔══██║██║██║╚██╗██║
██║  ██║██████╔╝██║  ██║██║  ██║██║  ██║    ██║  ██║╚██████╔╝███████║███████║██║  ██║██║██║ ╚████║    ███████╗██║  ██║██║  ██║██║██║ ╚████║
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
```

### `Abrar Hossain Zahin` · AI & ML Engineer · Researcher · Builder

<br/>

[![Portfolio](https://img.shields.io/badge/🌐_Live_Portfolio-purple?style=for-the-badge)](https://abrar-hossain-zahin-portfolio.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-green?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com/motion)

<br/>

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Google Scholar](https://img.shields.io/badge/Google_Scholar-4285F4?style=flat-square&logo=googlescholar&logoColor=white)](https://scholar.google.com/citations?user=PggflFIAAAAJ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/md-abrar-hossain-zahin)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Zahin2470)

</div>

---

## ✦ About This Portfolio

A **dynamic, multi-page personal portfolio** built from the ground up with Next.js 14, Tailwind CSS, and Framer Motion. Designed for a cutting-edge AI/ML researcher — featuring animated particle backgrounds, 3D card interactions, a live AI chat assistant powered by Claude, a functional resume builder, and a complete research showcase.

> *"Turning data into intelligence, one model at a time."*

---

## ✦ Live Features

| Feature | Description | Route |
|---|---|---|
| 🏠 **Hero Page** | Animated particle grid, rotating profile orb, typing effect, skill marquee | `/` |
| 👤 **About** | Terminal-style info cards, animated skill bars, education timeline | `/about` |
| 🚀 **Projects** | 3D tilt cards, filterable by tech stack, gradient banners | `/projects` |
| 🔬 **Research** | Hexagon background, expandable paper cards, tag filters | `/research` |
| 🤖 **AI Assistant** | Claude-powered chatbot that knows everything about Zahin | `/chat` |
| 📄 **Resume Builder** | 7-section form with live preview + one-click PDF download | `/resume-builder` |
| 📬 **Connect** | Particle network background, contact form, branded social cards | `/connect` |

---

## ✦ Tech Stack

```
Frontend       Next.js 14 (App Router) · React 18
Styling        Tailwind CSS · Custom CSS Variables
Animation      Framer Motion · Canvas API (particle systems)
AI             Anthropic Claude API (server-side via Next.js API routes)
Deployment     Vercel (zero-config)
Fonts          Syne (display) · Inter (body) · Monospace accents
```

---

## ✦ Project Structure

```
zahin-portfolio/
│
├── src/
│   ├── app/
│   │   ├── page.js                  # Home — hero, stats, projects, research, resume & AI promos
│   │   ├── layout.js                # Root server layout + Syne font
│   │   ├── globals.css              # Global styles, Tailwind, custom scrollbar
│   │   ├── not-found.js             # 404 page
│   │   │
│   │   ├── about/page.js            # Bio, info cards, education, skill bars, social grid
│   │   ├── projects/page.js         # 3D tilt cards, tag filter, GitHub CTA
│   │   ├── research/page.js         # Expandable paper cards, hex background, Scholar CTA
│   │   ├── connect/page.js          # Particle bg, contact form, branded social cards
│   │   ├── chat/page.js             # AI assistant UI — messages, typing dots, suggestions
│   │   ├── resume-builder/page.js   # 7-tab form builder with live preview + PDF
│   │   │
│   │   └── api/
│   │       └── chat/route.js        # ⚡ Server-side Claude API proxy (keeps key safe)
│   │
│   ├── components/
│   │   ├── Navbar.js                # Sticky nav, mobile hamburger menu
│   │   ├── Footer.js                # Minimal footer
│   │   ├── ThemeWrapper.js          # Client-side layout shell
│   │   ├── ScrollToTop.js           # Floating purple scroll-to-top button
│   │   ├── AnimatedText.js          # Word-by-word stagger animation
│   │   ├── ProjectCard.js           # Reusable project card component
│   │   └── PageTransition.js        # Page fade wrapper
│   │
│   └── lib/
│       └── data.js                  # ⭐ SINGLE SOURCE OF TRUTH — edit this to update everything
│
├── public/
│   ├── images/profile/              # Place developer-pic-1.png here
│   └── resume.pdf                   # Place your CV PDF here
│
├── package.json
├── tailwind.config.js
├── next.config.js
└── .eslintrc.json
```

---

## ✦ Quick Start

### 1 · Install

```bash
npx create-next-app@14 zahin-portfolio
cd zahin-portfolio
npm install framer-motion
```

### 2 · Copy files

Replace the generated `src/` folder with the files from this repo.


### 3 · Add photo & resume

```
public/
├── images/profile/developer-pic-1.png    ← your profile photo
└── resume.pdf                            ← your CV
```

### 5 · Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## ✦ Deploying to Vercel

### Via GitHub (recommended)

```bash
git init && git add . && git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### ⚠️ Required — Add your API key

**Vercel Dashboard → Project → Settings → Environment Variables**

---

## ✦ Research Papers

| # | Title | Focus Areas |
|---|---|---|
| 01 | Privacy-Bandwidth Trade-offs in Post-Quantum TLS | Post-Quantum Crypto · TLS · Fingerprinting |
| 02 | TumorXAI: Explainable Brain MRI Tumor Classification | Medical AI · XAI · Self-Supervised Learning |
| 03 | GreenNet: Lightweight CNN for Sustainable Edge AI | Green AI · Knowledge Distillation · Edge |
| 04 | GastroVisionNet8: Gastric Cancer Classification with XAI | Medical AI · Attention · Explainable AI |
| 05 | SentiVec: Sentiment-Aware Movie Review Retrieval | NLP · Sentiment Analysis · Vector Retrieval |
| 06 | Date Palm Tree Monitoring via BYOL-Driven YOLOv12s | Computer Vision · YOLO · Drone Imagery |

📚 [View all on Google Scholar →](https://scholar.google.com/citations?user=PggflFIAAAAJ)

---

## ✦ Projects

| Project | Tech | Links |
|---|---|---|
| 🧓 ElderCare SuperApp | TypeScript · Next.js · AI | [GitHub](https://github.com/Zahin2470/ElderCare-SuperApp) |
| 💼 Job Portal | React · Node.js · MongoDB | [GitHub](https://github.com/Zahin2470/Job-Portal) · [Demo](https://job-portal-five-sable.vercel.app) |
| 🌍 Green Browsing Tracker | JavaScript · Chrome Extension | [GitHub](https://github.com/Zahin2470/Green-Browsing-Tracker) |
| 🩸 Blood Donation Management | React · Node.js · Oracle | [GitHub](https://github.com/Zahin2470/Blood-Donation-Management-Software) · [Demo](https://apex.oracle.com/pls/apex/r/blood_donation_system/heart2blood174735/login) |
| 🎮 Multiplication Game | C · Game Dev | [GitHub](https://github.com/Zahin2470/Multiplication-Game) |
| 💬 Chat Application | React · WebSocket · Node.js | [GitHub](https://github.com/Zahin2470/Chat-Application) |

---

## ✦ Connect

<div align="center">

| Platform | Link |
|---|---|
| 🌐 Portfolio | [abrar-hossain-zahin-portfolio.vercel.app](https://abrar-hossain-zahin-portfolio.vercel.app) |
| 💼 LinkedIn | [linkedin.com/in/md-abrar-hossain-zahin](https://linkedin.com/in/md-abrar-hossain-zahin) |
| 🐙 GitHub | [github.com/Zahin2470](https://github.com/Zahin2470) |
| 📊 Kaggle | [kaggle.com/mdabrarhossainzahin](https://kaggle.com/mdabrarhossainzahin) |
| 🔬 ResearchGate | [researchgate.net/profile/Abrar-Zahin-7](https://researchgate.net/profile/Abrar-Zahin-7) |
| 📚 Google Scholar | [scholar.google.com/citations?user=PggflFIAAAAJ](https://scholar.google.com/citations?user=PggflFIAAAAJ) |
| ⚔️ LeetCode | [leetcode.com/u/MdZahin](https://leetcode.com/u/MdZahin) |
| 💻 CodeForces | [codeforces.com/profile/MD.Zahin](https://codeforces.com/profile/MD.Zahin) |
| 🎥 YouTube | [youtube.com/@Abrar_Hossain_Zahin](https://youtube.com/@Abrar_Hossain_Zahin) |

</div>

---

**© 2026 Abrar Hossain Zahin · MIT License**

*Open to research collaborations, internships, and exciting AI/ML projects*

</div>
