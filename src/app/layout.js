import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata = {
  title: "Abrar Hossain Zahin | AI & ML Engineer",
  description: "Aspiring AI & ML Engineer | Deep Learning, NLP, Computer Vision, Medical AI researcher at East West University, Dhaka.",
  authors: [{ name: "Abrar Hossain Zahin" }],
  openGraph: {
    title: "Abrar Hossain Zahin | AI & ML Engineer",
    description: "Aspiring AI & ML Engineer | Researcher in Medical AI, XAI, Green AI, Post-Quantum Cryptography",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}