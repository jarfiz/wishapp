"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/lib/../components/ui/button";

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
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenQuickAdd}
          size="sm"
          className="gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Wish</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
}
