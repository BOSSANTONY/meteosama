"use client";

import {
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
  if (typeof window !== "undefined") {
    return document.documentElement.classList.contains("dark") || 
           localStorage.getItem("theme") === "dark";
  }
  return false;
});

  function toggleTheme() {
    const next = !dark;

    document.documentElement.classList.toggle(
      "dark",
      next
    );

    localStorage.setItem(
      "bejart-meteo-theme",
      next ? "dark" : "light"
    );

    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={
        dark
          ? "Activer le mode clair"
          : "Activer le mode sombre"
      }
    >
      {dark ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}