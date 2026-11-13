"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (nextTheme: "light" | "dark") => void;
}

export function ThemeToggle({ className, onThemeChange }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    onThemeChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle color theme"
      title="Toggle light/dark mode"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white transition-colors cursor-pointer",
        className
      )}
    >
      <Sun className="h-4 w-4 hidden dark:block text-amber-400" />
      <Moon className="h-4 w-4 block dark:hidden text-indigo-600" />
    </button>
  );
}

