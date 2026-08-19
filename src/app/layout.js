import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

const BASE_URL = "https://abrar-hossain-zahin-portfolio.vercel.app";

/*
  ── Structured Data (JSON-LD) ──────────────────────────────
  This tells Google exactly WHO you are.
  When someone searches "Abrar Hossain Zahin", Google reads
  this and shows your portfolio with your name, title, and links.
  This is the single most powerful SEO move you can make.
*/
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name:         "Abrar Hossain Zahin",
  alternateName:["Abrar Zahin", "MD Abrar Hossain Zahin"],
  url:           BASE_URL,
  image:         `${BASE_URL}/images/profile/developer-pic-1.png`,
  description:
    "Full Stack AI/ML Engineer and researcher at East West University, Dhaka, Bangladesh. " +
    "Specialising in Deep Learning, Computer Vision, NLP, Medical AI, XAI, and Green AI.",
  jobTitle:      "Full Stack AI/ML Engineer",
  worksFor: {
    "@type": "EducationalOrganization",
    name:    "East West University",
    url:     "https://www.ewubd.edu",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name:    "East West University",
    url:     "https://www.ewubd.edu",
  },
  address: {
    "@type":           "PostalAddress",
    addressLocality:   "Dhaka",
    addressCountry:    "BD",
  },
  sameAs: [
    "https://github.com/Zahin2470",
    "https://linkedin.com/in/md-abrar-hossain-zahin",
    "https://kaggle.com/mdabrarhossainzahin",
    "https://scholar.google.com/citations?user=PggflFIAAAAJ",
    "https://researchgate.net/profile/Abrar-Zahin-7",
    "https://leetcode.com/u/MdZahin",
    "https://codeforces.com/profile/MD.Zahin",
    "https://youtube.com/@Abrar_Hossain_Zahin",
  ],
  knowsAbout: [
    "Machine Learning", "Deep Learning", "Computer Vision",
    "Natural Language Processing", "Explainable AI", "Green AI",
    "Medical Imaging AI", "Post-Quantum Cryptography",
    "Next.js", "Python", "TensorFlow", "PyTorch",
  ],
};

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "Abrar Hossain Zahin | Full Stack AI/ML Engineer",
    template: "%s | Abrar Hossain Zahin",
  },

  description:
    "Abrar Hossain Zahin - Full Stack AI/ML Engineer and researcher at East West University, Dhaka, Bangladesh. " +
    "Published research in Deep Learning, Computer Vision, NLP, Medical AI, XAI, and Green AI. " +
    "6+ research papers · 10+ projects · 4 free AI tools.",

  keywords: [
    "Abrar Hossain Zahin",
    "Abrar Zahin",
    "MD Abrar Hossain Zahin",
    "Full Stack AI/ML Engineer Bangladesh",
    "Deep Learning Researcher Bangladesh",
    "East West University CSE",
    "EWU AI Researcher",
    "Computer Vision NLP Bangladesh",
    "TumorXAI",
    "GreenNet AI",
    "Medical AI researcher",
    "Portfolio Next.js developer",
    "Full Stack AI engineer",
  ],

  authors:  [{ name: "Abrar Hossain Zahin", url: BASE_URL }],
  creator:  "Abrar Hossain Zahin",
  publisher:"Abrar Hossain Zahin",

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.svg",
  },

  openGraph: {
    type:        "profile",
    firstName:   "Abrar Hossain",
    lastName:    "Zahin",
    username:    "Zahin2470",
    url:         BASE_URL,
    siteName:    "Abrar Hossain Zahin Portfolio",
    title:       "Abrar Hossain Zahin | Full Stack AI/ML Engineer",
    description:
      "Full Stack AI/ML Engineer and researcher at EWU Dhaka — Deep Learning, Computer Vision, NLP, Green AI. " +
      "6+ papers · 10+ projects · 4 free AI tools.",
    images: [{
      url:    "/api/og",
      width:  1200,
      height: 630,
      alt:    "Abrar Hossain Zahin — Full Stack AI/ML Engineer Portfolio",
    }],
    locale: "en_US",
  },

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index:     true,
    follow:    true,
    nocache:   false,
    googleBot: {
      index:              true,
      follow:             true,
      "max-image-preview":"large",
      "max-snippet":      -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
