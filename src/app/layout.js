"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Abrar Hossain Zahin | AI &amp; ML Engineer</title>
        <meta name="description" content="Aspiring AI & ML Engineer | Deep Learning, NLP, Computer Vision, Medical AI researcher at East West University, Dhaka." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Abrar Hossain Zahin" />
        <meta property="og:title" content="Abrar Hossain Zahin | AI & ML Engineer" />
        <meta property="og:description" content="Aspiring AI & ML Engineer | Researcher in Medical AI, XAI, Green AI, Post-Quantum Cryptography" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
