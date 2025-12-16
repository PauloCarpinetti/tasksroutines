"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

export default function ThemeToogle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="relative"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Alternar Tema"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute top-0 left-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
