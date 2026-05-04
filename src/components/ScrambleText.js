"use client";
import { useEffect, useRef, useState } from "react";

/**
 * ScrambleText
 * Letters scramble randomly then resolve to the final word
 * when the element scrolls into view (IntersectionObserver).
 * Re-triggers every time it enters the viewport.
 *
 * Props:
 *   text      — the final string to display (required)
 *   className — CSS classes forwarded to the <span>
 *   speed     — ms between each character update (default 35)
 *   duration  — total scramble duration in ms (default 900)
 *   chars     — character set used for scrambling
 *   tag       — HTML tag to render as (default "span")
 *   once      — if true, only plays once on first view (default false)
 *
 * Usage:
 *   import ScrambleText from "@/components/ScrambleText";
 *
 *   <h1>
 *     <ScrambleText text="Abrar Hossain" className="text-white" />
 *     {" "}
 *     <ScrambleText text="Zahin" className="text-purple-400" />
 *   </h1>
 *
 *   <ScrambleText
 *     text="Publications"
 *     tag="h2"
 *     className="font-black text-zinc-100"
 *     speed={40}
 *     duration={1100}
 *   />
 */

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>/\\~^";

export default function ScrambleText({
  text,
  className   = "",
  speed       = 35,
  duration    = 900,
  chars       = DEFAULT_CHARS,
  tag         = "span",
  once        = false,
}) {
  const ref       = useRef(null);
  const [disp, setDisp] = useState(text);   // displayed text
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

      // How many characters are "locked" (resolved to final value)
      const locked = Math.floor(progress * text.length);

      const result = text
        .split("")
        .map((char, i) => {
          // Spaces stay spaces always
          if (char === " ") return " ";
          // Locked chars show the real letter
          if (i < locked)   return char;
          // Unlocked chars show a random character
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisp(result);

      if (frameRef.current >= totalFrames) {
        setDisp(text);            // ensure final text is exact
        clearInterval(intervalRef.current);
      }
    }, speed);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so page has settled before the effect starts
          setTimeout(scramble, 120);
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const Tag = tag;

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}            // screen readers always see the real text
      style={{
        fontVariantNumeric: "tabular-nums",  // prevents width jitter on numbers
        display: "inline",
      }}
    >
      {disp}
    </Tag>
  );
}

/**
 * ScrambleHeading — convenience wrapper for section headings.
 * Splits the title into a white first part + gradient last word.
 *
 * Usage:
 *   <ScrambleHeading title="What I've Built" tag="h2" />
 *   <ScrambleHeading title="Publications"    tag="h2" gradient="from-blue-400 to-cyan-400" />
 */
export function ScrambleHeading({
  title,
  tag         = "h2",
  gradient    = "from-purple-400 to-fuchsia-400",
  className   = "",
  fontSize    = "clamp(2rem,5vw,3.5rem)",
  duration    = 950,
}) {
  const words     = title.split(" ");
  const lastWord  = words[words.length - 1];
  const firstPart = words.slice(0, -1).join(" ");

  const Tag = tag;

  return (
    <Tag
      className={`font-black leading-none ${className}`}
      style={{ fontFamily: "'Syne',sans-serif", fontSize, letterSpacing: "-0.04em" }}
    >
      {firstPart && (
        <>
          <ScrambleText
            text={firstPart}
            className="text-zinc-100"
            duration={duration}
          />
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
