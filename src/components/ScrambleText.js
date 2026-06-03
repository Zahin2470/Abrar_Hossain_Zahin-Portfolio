"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";

/* ── ScrambleText — single string ───────────────────────
   Scrolls into view → letters scramble → resolve left→right

   Props:
     text      string   — final text to display
     className string   — CSS classes
     speed     number   — ms between frames      (default 35)
     duration  number   — total animation in ms  (default 900)
     chars     string   — scramble character set
     once      boolean  — only play once          (default false)
──────────────────────────────────────────────────────── */
export default function ScrambleText({
  text,
  className = "",
  speed     = 35,
  duration  = 900,
  chars     = DEFAULT_CHARS,
  once      = false,
}) {
  const ref         = useRef(null);
  const [disp, setDisp] = useState(text);
  const intervalRef = useRef(null);
  const frameRef    = useRef(0);
  const hasPlayed   = useRef(false);

  const scramble = () => {
    if (once && hasPlayed.current) return;
    hasPlayed.current = true;

    const totalFrames = Math.floor(duration / speed);
    frameRef.current  = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;
      const locked   = Math.floor(progress * text.length);

      setDisp(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < locked) return ch;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (frameRef.current >= totalFrames) {
        setDisp(text);
        clearInterval(intervalRef.current);
      }
    }, speed);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(scramble, 120);
          if (once) obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => { obs.unobserve(el); clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ fontVariantNumeric: "tabular-nums", display: "inline" }}
    >
      {disp}
    </span>
  );
}

/* ── ScrambleHeading — section heading convenience wrapper
   Splits title into "white first words" + "gradient last word"

   Usage:
     <ScrambleHeading title="What I've Built" />
     <ScrambleHeading title="Publications" gradient="from-blue-400 to-cyan-400" />
──────────────────────────────────────────────────────── */
export function ScrambleHeading({
  title,
  tag      = "h2",
  gradient = "from-purple-400 to-fuchsia-400",
  className= "",
  fontSize = "clamp(2rem,5vw,3.5rem)",
  duration = 950,
}) {
  const words     = title.split(" ");
  const lastWord  = words[words.length - 1];
  const firstPart = words.slice(0, -1).join(" ");
  const Tag       = tag;

  return (
    <Tag
      className={`font-black leading-none ${className}`}
      style={{ fontFamily:"'Syne',sans-serif", fontSize, letterSpacing:"-0.04em" }}
    >
      {firstPart && (
        <>
          <ScrambleText text={firstPart} className="text-zinc-100" duration={duration} />
          {" "}
        </>
      )}
      <ScrambleText
        text={lastWord}
        className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}
        duration={duration + 100}
      />
    </Tag>
  );
}
