/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 10s linear infinite",
      },
    },
  },
  safelist: [
    'from-purple-500', 'to-pink-500',
    'from-emerald-500', 'to-cyan-500',
    'from-green-500', 'to-teal-500',
    'from-red-500', 'to-rose-500',
    'from-yellow-500', 'to-orange-500',
    'from-indigo-500', 'to-violet-500',
    'bg-gradient-to-br',
  ],
  plugins: [],
};
