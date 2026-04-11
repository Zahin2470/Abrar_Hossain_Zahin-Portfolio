import { siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 text-center text-zinc-500 text-sm border-t border-zinc-800 bg-zinc-950">
      © {new Date().getFullYear()} {siteConfig.name} ♡
    </footer>
  );
}
