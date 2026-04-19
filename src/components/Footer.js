import { siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm
                       border-t border-zinc-200 dark:border-zinc-800
                       bg-white dark:bg-zinc-950
                       text-zinc-400 dark:text-zinc-500
                       transition-colors duration-300">
      © {new Date().getFullYear()} {siteConfig.name} &amp; ♡
    </footer>
  );
}
