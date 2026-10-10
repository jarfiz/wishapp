import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "destructive"
    | "indigo"
    | "purple"
    | "emerald"
    | "amber";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900 shadow-xs",
    secondary:
      "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60",
    outline:
      "text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25",
    warning:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25",
    amber:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25",
    destructive:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25",
    indigo:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25",
    purple:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/25",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors select-none",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}
