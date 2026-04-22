"use client";
import { useEffect, useRef } from "react";

/**
 * useScrollReveal hook
 * Attach to any container ref — all direct children with
 * data-reveal or the .reveal class will animate in when scrolled into view.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}>
 *     <div data-reveal>I fade in</div>
 *     <div data-reveal="slide-left">I slide from left</div>
 *     <div data-reveal="slide-right">I slide from right</div>
 *     <div data-reveal="scale">I scale up</div>
 *   </section>
 *
 * Works with stagger: add data-reveal-delay="0.1" (seconds).
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const threshold = options.threshold ?? 0.12;
    const els = [];

    const query = ref.current
      ? ref.current.querySelectorAll("[data-reveal], .reveal")
      : document.querySelectorAll("[data-reveal], .reveal");

    query.forEach((el, i) => {
      const variant = el.dataset.reveal || "fade";
      const delay   = parseFloat(el.dataset.revealDelay ?? 0) || i * 0.07;
      const duration= parseFloat(el.dataset.revealDuration ?? 0.65);

      // Initial hidden state
      el.style.opacity    = "0";
      el.style.transition = `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                              transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`;
      switch (variant) {
        case "slide-left":  el.style.transform = "translateX(-32px)"; break;
        case "slide-right": el.style.transform = "translateX(32px)";  break;
        case "slide-up":
        case "fade":        el.style.transform = "translateY(28px)";  break;
        case "scale":       el.style.transform = "scale(0.92)";       break;
        case "none":        el.style.transform = "none";              break;
        default:            el.style.transform = "translateY(28px)";
      }

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = "1";
          el.style.transform = "none";
          obs.unobserve(el);
        }
      }, { threshold });

      obs.observe(el);
      els.push({ el, obs });
    });

    return () => els.forEach(({ el, obs }) => {
      obs.unobserve(el);
      // Reset so re-mounting works
      el.style.opacity    = "";
      el.style.transform  = "";
      el.style.transition = "";
    });
  }, []);

  return ref;
}

/**
 * ScrollReveal component wrapper — use when you can't use the hook directly
 * <ScrollReveal variant="slide-left" delay={0.2}>
 *   <YourComponent />
 * </ScrollReveal>
 */
export default function ScrollReveal({ children, variant = "fade", delay = 0, duration = 0.65, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    el.style.opacity    = "0";
    el.style.transition = `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                            transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`;
    switch (variant) {
      case "slide-left":  el.style.transform = "translateX(-32px)"; break;
      case "slide-right": el.style.transform = "translateX(32px)";  break;
      case "scale":       el.style.transform = "scale(0.92)";       break;
      default:            el.style.transform = "translateY(28px)";
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity   = "1";
        el.style.transform = "none";
        obs.unobserve(el);
      }
    }, { threshold: 0.12 });

    obs.observe(el);
    return () => obs.unobserve(el);
  }, [variant, delay, duration]);

  return <div ref={ref} className={className}>{children}</div>;
}
