"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * MagneticButton
 * Wraps any element — when cursor enters the area the element
 * magnetically pulls toward the cursor. On leave it springs back.
 *
 * Props:
 *   strength  — how much it moves (default 0.35, range 0.1–0.6)
 *   radius    — detection radius in px (default 80)
 *   className — forwarded to wrapper div
 *   children  — any content (button, link, icon, div...)
 *
 * Usage:
 *   <MagneticButton>
 *     <button className="...">Click me</button>
 *   </MagneticButton>
 *
 *   <MagneticButton strength={0.5} radius={100}>
 *     <Link href="/connect">...</Link>
 *   </MagneticButton>
 */
export default function MagneticButton({
  children,
  strength  = 0.35,
  radius    = 80,
  className = "",
}) {
  const ref  = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      setHov(true);
      setPos({ x: dx * strength, y: dy * strength });
    } else {
      setHov(false);
      setPos({ x: 0, y: 0 });
    }
  };

  const onLeave = () => {
    setHov(false);
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={
        hov
          ? { type: "spring", stiffness: 200, damping: 14, mass: 0.5 }
          : { type: "spring", stiffness: 300, damping: 25 }   // snaps back fast
      }
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
