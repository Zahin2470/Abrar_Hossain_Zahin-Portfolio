// src/app/sitemap.js
// Next.js App Router auto-generates /sitemap.xml from this file.
// Google reads sitemap.xml to discover and index all your pages.

export default function sitemap() {
  const BASE = "https://abrar-hossain-zahin-portfolio.vercel.app";
  const now  = new Date().toISOString();

  return [
    { url: BASE,                           lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/research`,             lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/projects`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/connect`,              lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/case-studies`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/chat`,                 lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/paper-summarizer`,     lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/research-ideas`,       lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/resume-builder`,       lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/cover-page`,           lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/gpa-calculator`,       lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/data-visualizer`,      lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
  ];
}
