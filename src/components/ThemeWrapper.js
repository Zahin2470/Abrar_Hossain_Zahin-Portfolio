"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CustomCursor from "@/components/CustomCursor";
import StarCanvas from "@/components/StarCanvas";

export const ThemeContext = createContext({ dark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function ThemeWrapper({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(saved ? saved === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>

      {/* Layer 1 — Star canvas: fixed, below everything */}
      <StarCanvas />

      {/* Layer 2 — Page content: sits above canvas.
          MUST use position:relative + zIndex:2.
          Page backgrounds are transparent so canvas shows through. */}
      <div style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
      }}>
        <Navbar />
        <main style={{ flex: 1, background: "transparent" }}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Layer 3 — Cursor: always on top */}
      <CustomCursor />

    </ThemeContext.Provider>
  );
}
