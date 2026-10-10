"use client";

import * as React from "react";
import Link from "next/link";
import { formatMoney, type CurrencyCode } from "@/lib/money";
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs transition-all duration-200 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
      {/* Top Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        {goal.coverImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={goal.coverImageUrl}
            alt={goal.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-zinc-950 text-indigo-300 dark:text-indigo-800">
            <Compass className="h-10 w-10 stroke-[1.3]" />
            <span className="mt-1 text-[11px] font-semibold tracking-wider uppercase text-indigo-400 dark:text-indigo-600">
              Life Quest
            </span>
          </div>
        )}

        {/* Vision board tag */}
        {goal.onVisionBoard ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-indigo-900/80 px-2 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>Vision Board</span>
          </div>
        ) : null}

        {/* Action Menu */}
        <div className="absolute top-2.5 right-2.5" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full bg-white/90 p-1.5 text-zinc-700 shadow-sm backdrop-blur-md hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu ? (
            <div className="absolute right-0 top-8 z-40 w-40 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(goal);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-zinc-400" />
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
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base line-clamp-1">
              {goal.title}
            </h3>
            <Badge
              variant={
                isCompleted ? "success" : goal.status === "paused" ? "warning" : "default"
              }
              className="text-[10px] capitalize py-0"
            >
              {goal.status}
            </Badge>
          </div>

          {goal.description ? (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {goal.description}
            </p>
          ) : null}

          {/* Milestone Progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Milestones ({goal.completedMilestones || 0} / {goal.totalMilestones || 0})
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {goal.progressPercent || 0}%
              </span>
            </div>
            <Progress value={goal.progressPercent || 0} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            {goal.targetAmount ? (
              <>
                <span className="text-[10px] uppercase font-medium text-zinc-400">
                  Target Amount
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {formatMoney(goal.targetAmount, currency)}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-zinc-500">
                Experience Quest
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              title={isCompleted ? "Reopen goal" : "Complete goal"}
              className={`rounded-lg p-2 transition-colors cursor-pointer ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                  : "border border-zinc-200 text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-800"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <Link href={`/goals/${goal.id}`}>
              <button className="flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer shadow-xs">
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
