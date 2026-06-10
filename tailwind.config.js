/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable holding "R G B" channels, so Tailwind's
// opacity modifiers (e.g. bg-surface/70) keep working while the actual values
// swap between light and dark in index.css.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces
        base: token("base"), // page background
        surface: token("surface"), // panels / cards
        elevated: token("elevated"), // raised controls
        code: token("code"), // code / editor surface (calm, distinct from cards)
        line: token("line"), // borders / dividers
        // Text
        fg: token("fg"), // primary text
        muted: token("muted"), // secondary text
        subtle: token("subtle"), // tertiary text / icons
        // Visualization accents
        run: token("run"), // play / sorted / success
        compare: token("compare"), // active comparison
        pivot: token("pivot"), // pivot / key
        swap: token("swap"), // swap / collision
        visited: token("visited"), // visited / path
        bar: token("bar"), // default (unsorted) bar / cell
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "pulse-glow": "pulse-glow 1.6s ease-in-out infinite",
        "pop-in": "pop-in 0.28s ease-out both",
      },
    },
  },
  plugins: [],
};
