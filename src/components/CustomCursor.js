"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -300, y: -300 });
  const ring    = useRef({ x: -300, y: -300 });
  const raf     = useRef(null);
  const [active,  setActive]  = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove  = (e) => { pos.current = { x: e.clientX, y: e.clientY }; setVisible(true); };
    const onLeave = ()  => setVisible(false);
    const onEnter = ()  => setVisible(true);
    const onOver  = (e) => setActive(!!e.target.closest("a,button,[role='button'],input,textarea,select,label"));

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseover",  onOver,  { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      const dot = dotRef.current;
      const rng = ringRef.current;
      if (dot && rng) {
        // Dot snaps
        dot.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
        // Ring lags
        ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
        ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
        rng.style.transform = `translate(${ring.current.x - 16}px,${ring.current.y - 16}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseover",  onOver);
    };
  }, []);

  return (
    <>
      {/* Gold dot — 8px */}
      <div ref={dotRef} aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: "50%",
          background: "radial-gradient(circle,#fde68a,#c9a84c)",
          boxShadow: `0 0 ${active ? 14 : 8}px ${active ? 5 : 2}px rgba(201,168,76,${active ? 0.8 : 0.5})`,
          zIndex: 99999, pointerEvents: "none",
          transform: "translate(-300px,-300px)",
          opacity: visible ? 1 : 0,
          transition: "box-shadow 0.2s, opacity 0.3s",
          willChange: "transform",
        }} />

      {/* Gold ring — lags */}
      <div ref={ringRef} aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          width:  active ? 40 : 32,
          height: active ? 40 : 32,
          borderRadius: "50%",
          border: `1.5px solid rgba(201,168,76,${active ? 0.9 : 0.5})`,
          boxShadow: `0 0 ${active ? 16 : 8}px rgba(201,168,76,${active ? 0.25 : 0.1})`,
          zIndex: 99998, pointerEvents: "none",
          transform: "translate(-300px,-300px)",
          opacity: visible ? 1 : 0,
          transition: "width 0.25s,height 0.25s,border-color 0.2s,box-shadow 0.25s,opacity 0.3s",
          willChange: "transform",
        }} />
    </>
  );
}
