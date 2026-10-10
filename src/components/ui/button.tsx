import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "accent"
    | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 border border-indigo-400/20",
      secondary:
        "bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/50 shadow-xs",
      outline:
        "border border-slate-200/80 bg-white/80 text-slate-800 hover:bg-slate-100/80 hover:text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-slate-50 dark:hover:border-slate-700 backdrop-blur-sm shadow-xs",
      ghost:
        "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100",
      destructive:
        "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 hover:from-red-500 hover:to-rose-500 border border-red-400/20",
      accent:
        "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 border border-emerald-400/20",
      glass:
        "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-xs",
    }[variant];

    const sizeStyles = {
      default: "h-9.5 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs font-medium",
      lg: "h-11 rounded-xl px-6 text-base font-semibold",
      icon: "h-9 w-9 rounded-xl",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
