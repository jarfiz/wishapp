"use client";

import * as React from "react";
import { formatMoney, type CurrencyCode } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Eye,
  Plus,
  Trash2,
  Gift,
  Compass,
} from "lucide-react";
import { toggleVisionBoardItem } from "@/lib/actions/wishlist";
import { updateGoal } from "@/lib/actions/goals";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { WishlistItem, Goal } from "@/types";

interface VisionBoardViewProps {
  boardWishes: WishlistItem[];
  boardGoals: Goal[];
  allWishes: WishlistItem[];
  allGoals: Goal[];
  currency?: CurrencyCode;
}

export function VisionBoardView({
  boardWishes,
  boardGoals,
  allWishes,
  allGoals,
  currency = "IDR",
}: VisionBoardViewProps) {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [selectedWishToAdd, setSelectedWishToAdd] = React.useState("");
  const [selectedGoalToAdd, setSelectedGoalToAdd] = React.useState("");

  const handleRemoveWish = async (id: string, name: string) => {
    try {
      await toggleVisionBoardItem(id, false);
      toast.success(`Removed "${name}" from Vision Board`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      toast.error(msg);
    }
  };

  const handleRemoveGoal = async (id: string, title: string) => {
    try {
      await updateGoal(id, { onVisionBoard: false });
      toast.success(`Removed "${title}" from Vision Board`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove goal";
      toast.error(msg);
    }
  };

  const handleAddSelections = async () => {
    try {
      if (selectedWishToAdd) {
        await toggleVisionBoardItem(selectedWishToAdd, true);
      }
      if (selectedGoalToAdd) {
        await updateGoal(selectedGoalToAdd, { onVisionBoard: true });
      }
      toast.success("Vision Board updated! ✨");
      setSelectedWishToAdd("");
      setSelectedGoalToAdd("");
      setAddDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add items to board";
      toast.error(msg);
    }
  };

  // Items not currently on board
  const availableWishes = allWishes.filter((w) => !w.onVisionBoard);
  const availableGoals = allGoals.filter((g) => !g.onVisionBoard);

  const totalBoardItems = boardWishes.length + boardGoals.length;

  return (
    <div className="space-y-8">
      {/* Vision Board Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 border border-indigo-400/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Personal Aspiration Canvas</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              My Vision Board
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Surround yourself with the future you are building. Manifest through clarity, intentional savings, and consistent daily execution.
            </p>
          </div>

          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-white text-indigo-950 hover:bg-zinc-100 shadow-md font-semibold gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 text-indigo-600" />
            <span>Pin Dream to Board</span>
          </Button>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Board Visual Grid */}
      {totalBoardItems > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Goals Pinned to Vision Board */}
          {boardGoals.map((goal) => (
            <div
              key={goal.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/60"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                {goal.coverImageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={goal.coverImageUrl}
                    alt={goal.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-tr from-indigo-900 to-indigo-950 text-indigo-300">
                    <Compass className="h-16 w-16 stroke-[1.2] opacity-80" />
                    <span className="mt-2 text-xs font-bold uppercase tracking-widest text-indigo-200">
                      Life Quest
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveGoal(goal.id, goal.title)}
                  className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove from vision board"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute top-3 left-3">
                  <Badge variant="indigo" className="gap-1 shadow-sm">
                    <Compass className="h-3 w-3" />
                    <span>Goal</span>
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                    {goal.title}
                  </h3>
                  {goal.description ? (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {goal.description}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {goal.completedMilestones || 0} / {goal.totalMilestones || 0} Milestones
                  </span>
                  <Link
                    href={`/goals/${goal.id}`}
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    View Quest →
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Wishes Pinned to Vision Board */}
          {boardWishes.map((wish) => (
            <div
              key={wish.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/60"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                {wish.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={wish.imageUrl}
                    alt={wish.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-tr from-violet-900 to-indigo-950 text-violet-300">
                    <Gift className="h-16 w-16 stroke-[1.2] opacity-80" />
                    <span className="mt-2 text-xs font-bold uppercase tracking-widest text-violet-200">
                      Wish
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveWish(wish.id, wish.name)}
                  className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove from vision board"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute top-3 left-3">
                  <Badge variant="indigo" className="gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    <span>Wish</span>
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                    {wish.name}
                  </h3>
                  {wish.notes ? (
                    <p className="mt-1 text-xs italic text-indigo-600 dark:text-indigo-400 line-clamp-2">
                      &ldquo;{wish.notes}&rdquo;
                    </p>
                  ) : wish.description ? (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {wish.description}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {wish.estimatedPrice
                      ? formatMoney(wish.estimatedPrice, currency)
                      : "Price not set"}
                  </span>
                  <Link
                    href="/wishlist"
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    View Wish →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200/90 bg-white/50 p-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Eye className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Your Vision Board is currently empty
          </h3>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Feature your favorite goals and wishlist items here to create a personal visual board of what you are working toward.
          </p>
          <div className="mt-6">
            <Button onClick={() => setAddDialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Pin Your First Dream</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add Items to Vision Board Modal */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <DialogTitle>Pin Items to Vision Board</DialogTitle>
            </div>
            <DialogDescription>
              Select items from your existing wishlist or goals to display on your board.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select Wishlist Item
              </label>
              <select
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                value={selectedWishToAdd}
                onChange={(e) => setSelectedWishToAdd(e.target.value)}
              >
                <option value="">Choose a wish...</option>
                {availableWishes.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select Life Goal
              </label>
              <select
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                value={selectedGoalToAdd}
                onChange={(e) => setSelectedGoalToAdd(e.target.value)}
              >
                <option value="">Choose a goal...</option>
                {availableGoals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSelections}
              disabled={!selectedWishToAdd && !selectedGoalToAdd}
            >
              Add to Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
