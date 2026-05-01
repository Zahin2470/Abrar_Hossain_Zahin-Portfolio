import { ImageResponse } from "next/og";

export const runtime = "edge";

const BASE_URL = "https://abrar-hossain-zahin-portfolio.vercel.app";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #05050a 0%, #0d0520 40%, #05050a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background star dots */}
        {[
          [120,80],[300,150],[500,60],[750,120],[950,80],[1100,160],
          [200,300],[450,250],[700,280],[900,260],[1050,320],
          [80,420],[350,380],[600,440],[820,400],[1120,450],
          [180,550],[420,510],[680,560],[980,530],
        ].map(([x, y], i) => (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: `rgba(201,168,76,${0.3 + (i % 5) * 0.12})`,
            display: "flex",
          }} />
        ))}

        {/* Purple glow blobs */}
        <div style={{
          position: "absolute", left: -100, top: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", right: -80, bottom: -80,
          width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,56,202,0.20) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", right: 200, top: 0,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Gold top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(to right, transparent, rgba(201,168,76,0.8), rgba(168,85,247,0.8), transparent)",
          display: "flex",
        }} />

        {/* Gold bottom border */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(to right, transparent, rgba(201,168,76,0.8), rgba(168,85,247,0.8), transparent)",
          display: "flex",
        }} />

        {/* Content */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", zIndex: 10,
        }}>

          {/* ── PROFILE PHOTO ── */}
          {/* Outer glow ring */}
          <div style={{
            width: 108, height: 108, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #db2777, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
            boxShadow: "0 0 40px rgba(168,85,247,0.55), 0 0 80px rgba(168,85,247,0.22)",
            padding: 3,           /* acts as the coloured border ring */
          }}>
            {/* Inner white circle — clips the photo into a circle */}
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              overflow: "hidden", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              {/*
                IMPORTANT: ImageResponse requires an absolute URL.
                Local files like /images/... must be prefixed with BASE_URL.
              */}
              <img
                src={`${BASE_URL}/images/profile/developer-pic-1.png`}
                width={102}
                height={102}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                alt="Abrar Hossain Zahin"
              />
            </div>
          </div>

          {/* Name */}
          <div style={{
            display: "flex", fontSize: 62, fontWeight: 900,
            letterSpacing: "-2px", marginBottom: 8, lineHeight: 1,
          }}>
            <span style={{ color: "#ffffff" }}>Abrar Hossain Zahin&nbsp;</span>
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: 24, color: "rgba(201,168,76,0.90)",
            fontWeight: 600, letterSpacing: "3px",
            textTransform: "uppercase", marginBottom: 28,
          }}>
            AI & ML Engineer · Researcher · Builder
          </div>

          {/* Divider */}
          <div style={{
            width: 120, height: 2, marginBottom: 28, display: "flex",
            background: "linear-gradient(to right, transparent, rgba(168,85,247,0.7), transparent)",
          }} />

          {/* Tag pills */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {["Deep Learning", "Computer Vision", "NLP", "Green AI", "XAI"].map(tag => (
              <div key={tag} style={{
                padding: "6px 16px", borderRadius: 20,
                border: "1px solid rgba(168,85,247,0.40)",
                background: "rgba(168,85,247,0.12)",
                color: "rgba(192,132,252,0.95)",
                fontSize: 14, fontWeight: 600, display: "flex",
              }}>
                {tag}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40 }}>
            {[
              { num: "5+", label: "Research Papers" },
              { num: "10+", label: "Projects Built"  },
              { num: "4",  label: "AI Tools"         },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                  {s.num}
                </span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", letterSpacing: 1 }}>
                  {s.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* URL */}
          <div style={{
            marginTop: 32, fontSize: 16,
            color: "rgba(255,255,255,0.35)", letterSpacing: "1px",
          }}>
            abrar-hossain-zahin-portfolio.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}