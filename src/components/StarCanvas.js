"use client";
import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h, stars = [];
    // Mouse position — starts off screen
    let mx = -9999, my = -9999;

    const GOLD       = "201,168,76";
    const WEB_DIST   = 160;   // px — max distance for web lines
    const STAR_DIST  = 100;   // px — star-to-star connections

    /* ── Resize ────────────────────────────────────────── */
    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initStars();
    }

    /* ── Init stars ────────────────────────────────────── */
    function initStars() {
      const count = Math.floor((w * h) / 2000);
      stars = Array.from({ length: count }, () => ({
        x:     Math.random() * w,
        y:     Math.random() * h,
        r:     Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.35 + 0.05,
        dir:   Math.random() > 0.7 ? 1 : -1,
      }));
    }

    /* ── Draw ──────────────────────────────────────────── */
    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Deep dark background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // Twinkle stars
      stars.forEach(s => {
        s.alpha += s.speed * 0.018 * s.dir;
        if (s.alpha > 0.8 || s.alpha < 0.05) s.dir *= -1;

        // Draw star circle
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD},${s.alpha})`;
        ctx.fill();

        // Tiny glow for brighter stars
        if (s.alpha > 0.5 && s.r > 0.9) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD},${s.alpha * 0.18})`;
          ctx.fill();
        }
      });

      // Spider web from cursor to nearby stars
      if (mx > 0 && my > 0) {
        stars.forEach(s => {
          const d = Math.hypot(mx - s.x, my - s.y);
          if (d < WEB_DIST) {
            const strength = 1 - d / WEB_DIST;
            // Line: cursor → star
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = `rgba(${GOLD},${strength * 0.80})`;
            ctx.lineWidth   = strength * 1.4;
            ctx.stroke();

            // Star-to-star secondary web (nearby stars only)
            stars.forEach(s2 => {
              if (s2 === s) return;
              const d2 = Math.hypot(s.x - s2.x, s.y - s2.y);
              if (d2 < STAR_DIST) {
                const ds2 = Math.hypot(mx - s2.x, my - s2.y);
                if (ds2 < WEB_DIST) {
                  const str2 = (1 - d2 / STAR_DIST) * strength * 0.5;
                  ctx.beginPath();
                  ctx.moveTo(s.x, s.y);
                  ctx.lineTo(s2.x, s2.y);
                  ctx.strokeStyle = `rgba(${GOLD},${str2 * 0.4})`;
                  ctx.lineWidth   = str2 * 0.8;
                  ctx.stroke();
                }
              }
            });
          }
        });

        // Cursor glow dot
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, WEB_DIST * 0.5);
        grd.addColorStop(0,   `rgba(${GOLD},0.06)`);
        grd.addColorStop(0.4, `rgba(${GOLD},0.02)`);
        grd.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(mx, my, WEB_DIST * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    /* ── Track mouse ───────────────────────────────────── */
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onLeave= ()  => { mx = -9999; my = -9999; };
    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     resize);

    resize();
    draw();

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width:  "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
