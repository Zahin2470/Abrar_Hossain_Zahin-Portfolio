import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

const BASE_URL = "https://abrar-hossain-zahin-portfolio.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "Abrar Hossain Zahin | AI & ML Engineer",
    template: "%s | Abrar Hossain Zahin",
  },
  description:
    "AI & ML Engineer and researcher at East West University, Dhaka. " +
    "Specialising in Deep Learning, Computer Vision, NLP, Medical AI, XAI, and Green AI. " +
    "6+ research papers, 10+ projects, 4 free AI tools.",

  keywords: [
    "Abrar Hossain Zahin",
    "AI ML Engineer Bangladesh",
    "Deep Learning Researcher",
    "East West University CSE",
    "Computer Vision NLP",
    "TumorXAI GreenNet Research",
    "Portfolio Next.js",
  ],

  authors: [{ name: "Abrar Hossain Zahin", url: BASE_URL }],
  creator: "Abrar Hossain Zahin",

  /*
    Open Graph covers ALL major platforms:
    ✅ Facebook
    ✅ LinkedIn
    ✅ WhatsApp
    ✅ Telegram
    ✅ Discord
    ✅ Slack
    ✅ iMessage (iOS link previews)
    ✅ Reddit
    ✅ Signal
    All of these read og:image — no Twitter card needed.
  */
  openGraph: {
    type:        "website",
    url:         BASE_URL,
    siteName:    "Abrar Hossain Zahin Portfolio",
    title:       "Abrar Hossain Zahin | AI & ML Engineer",
    description:
      "AI & ML researcher at EWU Dhaka - Deep Learning, Computer Vision, NLP, Green AI. " +
      "6+ papers · 10+ projects · 4 free AI tools.",
    images: [
      {
        url:    "/api/og",
        width:  1200,
        height: 630,
        alt:    "Abrar Hossain Zahin — AI & ML Engineer Portfolio",
      },
    ],
    locale: "en_US",
  },

  alternates: { canonical: BASE_URL },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}