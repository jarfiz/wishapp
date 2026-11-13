"use client";

import * as React from "react";
import Link from "next/link";
import { type CurrencyCode } from "@/lib/money";
import { Money } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  MoreVertical,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { completeGoal, reopenGoal, deleteGoal } from "@/lib/actions/goals";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  currency?: CurrencyCode;
  onEdit: (goal: Goal) => void;
}

export function GoalCard({ goal, currency = "IDR", onEdit }: GoalCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCompleted = goal.status === "completed";

  const handleComplete = async () => {
    try {
      if (isCompleted) {
        await reopenGoal(goal.id);
        toast.info("Goal reopened");
      } else {
        await completeGoal(goal.id);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        toast.success(`Quest Completed! "${goal.title}" achieved! 🏆`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update goal";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete goal "${goal.title}"?`)) return;
    try {
      await deleteGoal(goal.id);
      toast.success("Goal deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete goal";
      toast.error(msg);
    }
    setShowMenu(false);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-xl dark:border-white/[0.07] dark:bg-[#11131B] dark:hover:border-white/[0.14]">
      {/* Top Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#0A0B10]">
        {goal.coverImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={goal.coverImageUrl}
            alt={goal.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-[#131622] dark:via-[#0F111A] dark:to-[#0A0B10] text-indigo-500/60 dark:text-indigo-400/50">
            <Compass className="h-10 w-10 stroke-[1.2]" />
            <span className="mt-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Life Quest
            </span>
          </div>
        )}

        {/* Vision board tag */}
        {goal.onVisionBoard ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md border border-white/15">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Vision Board</span>
          </div>
        ) : null}

        {/* Action Menu */}
        <div className="absolute top-2.5 right-2.5" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:bg-black/60 dark:text-slate-200 dark:hover:bg-black/80 dark:border dark:border-white/10 cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu ? (
            <div className="absolute right-0 top-8 z-40 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/[0.08] dark:bg-[#141722] animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(goal);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Goal</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                <span>Delete</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Goal Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
              {goal.title}
            </h3>
            <Badge
              variant={
                isCompleted ? "emerald" : goal.status === "paused" ? "amber" : "default"
              }
              className="text-[10px] capitalize py-0 shadow-xs"
            >
              {goal.status}
            </Badge>
          </div>

          {goal.description ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          ) : null}

          {/* Milestone Progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Milestones ({goal.completedMilestones || 0} / {goal.totalMilestones || 0})
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {goal.progressPercent || 0}%
              </span>
            </div>
            <Progress value={goal.progressPercent || 0} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-col">
            {goal.targetAmount ? (
              <>
                <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
                  Target Amount
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                  <Money amount={goal.targetAmount} currency={currency} />
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Experience Quest
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              title={isCompleted ? "Reopen goal" : "Complete goal"}
              className={`rounded-xl p-2 transition-all cursor-pointer ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20"
                  : "border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-white/[0.08] dark:text-slate-400 dark:hover:border-emerald-500/40"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <Link href={`/goals/${goal.id}`}>
              <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 cursor-pointer shadow-xs transition-colors">
                <span>Milestones</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
