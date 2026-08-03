import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

const BASE_URL = "https://abrar-hossain-zahin-portfolio.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  /*
    ── Browser tab title ─────────────────────────────────────
    Shows: "Abrar Hossain Zahin | Full Stack AI Engineer"
    On sub-pages: "About | Abrar Hossain Zahin" etc.
  */
  title: {
    default:  "Abrar Hossain Zahin | Full Stack AI Engineer",
    template: "%s | Abrar Hossain Zahin",
  },

  description:
    "Full Stack AI Engineer and researcher at East West University, Dhaka. " +
    "Deep Learning, Computer Vision, NLP, Medical AI, XAI, Green AI. " +
    "6+ research papers · 10+ projects · 4 free AI tools.",

  keywords: [
    "Abrar Hossain Zahin",
    "Full Stack AI Engineer Bangladesh",
    "Deep Learning Researcher",
    "East West University CSE",
    "Computer Vision NLP",
    "TumorXAI GreenNet",
    "Portfolio Next.js",
  ],

  authors:  [{ name: "Abrar Hossain Zahin", url: BASE_URL }],
  creator:  "Abrar Hossain Zahin",

  /*
    ── Favicon / app icons ───────────────────────────────────
    Place these files in /public/:
      favicon.svg      ← the AZ logo (SVG scales perfectly)
      favicon.ico      ← fallback for old browsers
      apple-touch-icon.png ← 180×180 for iPhone home screen
  */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.svg",
  },

  /*
    ── Open Graph ────────────────────────────────────────────
    WhatsApp, LinkedIn, Facebook preview card
  */
  openGraph: {
    type:        "website",
    url:         BASE_URL,
    siteName:    "Abrar Hossain Zahin",
    title:       "Abrar Hossain Zahin | Full Stack AI Engineer",
    description:
      "Full Stack AI researcher at EWU Dhaka - Deep Learning, Computer Vision, NLP, Green AI. " +
      "6+ papers · 10+ projects · 4 free AI tools.",
    images: [{
      url:    "/api/og",
      width:  1200,
      height: 630,
      alt:    "Abrar Hossain Zahin — Full Stack AI Engineer Portfolio",
    }],
    locale: "en_US",
  },

  alternates: { canonical: BASE_URL },

  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        {/* Preload Syne font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}