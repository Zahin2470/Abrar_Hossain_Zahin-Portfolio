// src/app/robots.js
// Next.js App Router auto-generates /robots.txt from this file.
// Tells Google: index everything, here is the sitemap.

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],   // don't index API routes
      },
    ],
    sitemap: "https://abrar-hossain-zahin-portfolio.vercel.app/sitemap.xml",
    host:    "https://abrar-hossain-zahin-portfolio.vercel.app",
  };
}
