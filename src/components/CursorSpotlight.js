"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CursorSpotlight
 * Renders a smooth radial gradient that follows the cursor across the entire viewport.
 * Desktop-only (hidden on touch devices). Zero impact on scrolling or clicking.
 */
export default function CursorSpotlight() {
  const divRef = useRef(null);
  const pos = useRef({ x: -1000, y: -1000 });
  const raf = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch-only devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = divRef.current;
    if (!el) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Smooth RAF loop — avoids jank from direct style mutations in event handler
    const tick = () => {
      if (el) {
        el.style.background = `radial-gradient(
          600px circle at ${pos.current.x}px ${pos.current.y}px,
          rgba(139, 92, 246, 0.07) 0%,
          rgba(139, 92, 246, 0.03) 30%,
          transparent 70%
        )`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={divRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9,
        pointerEvents: "none",
        transition: "opacity 0.4s ease",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
