"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { updateThemePreference } from "@/lib/actions/user";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
}

export function Header({
  title = "Overview",
  subtitle,
  onOpenMobileMenu,
  onOpenQuickAdd,
}: HeaderProps) {
  const handleThemeChange = (nextTheme: "light" | "dark") => {
    void updateThemePreference(nextTheme).catch(() => {
      // Non-blocking background sync
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 sm:px-8 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#090A0F]/80 transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-100 cursor-pointer transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle onThemeChange={handleThemeChange} />
        <Button
          onClick={onOpenQuickAdd}
          size="sm"
          className="gap-1.5 shadow-sm shadow-indigo-500/15"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Wish</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
}
