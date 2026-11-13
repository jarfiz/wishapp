"use client";

import * as React from "react";
import Link from "next/link";
import { type CurrencyCode } from "@/lib/money";
import { Money } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Link as LinkIcon,
  Unlink,
  Trophy,
  Calendar,
  Compass,
  Check,
  Edit,
} from "lucide-react";
import {
  toggleMilestone,
  addMilestone,
  deleteMilestone,
  linkWishlistItem,
  unlinkWishlistItem,
  completeGoal,
  reopenGoal,
  saveGoalReflection,
} from "@/lib/actions/goals";
import { GoalDialog } from "./goal-dialog";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { Goal, WishlistItem, GoalMilestone, LinkedWishlistItem } from "@/types";

interface GoalDetailViewProps {
  goal: Goal;
  allWishlistItems: WishlistItem[];
  currency?: CurrencyCode;
}

export function GoalDetailView({
  goal,
  allWishlistItems,
  currency = "IDR",
}: GoalDetailViewProps) {
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("");
  const [selectedItemIdToLink, setSelectedItemIdToLink] = React.useState("");
  const [isAddingMilestone, setIsAddingMilestone] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  // Reflection form state
  const [whatAchieved, setWhatAchieved] = React.useState(
    goal.reflection?.whatAchieved || ""
  );
  const [whyImportant, setWhyImportant] = React.useState(
    goal.reflection?.whyImportant || ""
  );
  const [whatLearned, setWhatLearned] = React.useState(
    goal.reflection?.whatLearned || ""
  );
  const [worthIt, setWorthIt] = React.useState(
    goal.reflection?.worthIt || ""
  );
  const [isSavingReflection, setIsSavingReflection] = React.useState(false);

  const isCompleted = goal.status === "completed";

  const handleToggleCompleteGoal = async () => {
    try {
      if (isCompleted) {
        await reopenGoal(goal.id);
        toast.info("Goal reopened");
      } else {
        await completeGoal(goal.id);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        toast.success(`Congratulations! "${goal.title}" marked as completed! 🏆`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update goal";
      toast.error(msg);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    try {
      setIsAddingMilestone(true);
      await addMilestone(goal.id, {
        title: newMilestoneTitle.trim(),
      });
      setNewMilestoneTitle("");
      toast.success("Milestone added");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add milestone";
      toast.error(msg);
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const handleToggleMilestone = async (mId: string, currentStatus: boolean) => {
    try {
      await toggleMilestone(mId, !currentStatus);
      if (!currentStatus) {
        confetti({ particleCount: 25, spread: 40 });
        toast.success("Milestone marked complete!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update milestone";
      toast.error(msg);
    }
  };

  const handleDeleteMilestone = async (mId: string) => {
    try {
      await deleteMilestone(mId);
      toast.success("Milestone removed");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete milestone";
      toast.error(msg);
    }
  };

  const handleLinkItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemIdToLink) return;

    try {
      await linkWishlistItem(goal.id, selectedItemIdToLink);
      setSelectedItemIdToLink("");
      toast.success("Wishlist item linked to goal");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to link item";
      toast.error(msg);
    }
  };

  const handleUnlinkItem = async (itemId: string) => {
    try {
      await unlinkWishlistItem(goal.id, itemId);
      toast.success("Wishlist item unlinked");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to unlink item";
      toast.error(msg);
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatAchieved.trim()) {
      toast.error("Please describe what you achieved");
      return;
    }

    try {
      setIsSavingReflection(true);
      await saveGoalReflection(goal.id, {
        whatAchieved: whatAchieved.trim(),
        whyImportant: whyImportant.trim() || undefined,
        whatLearned: whatLearned.trim() || undefined,
        worthIt: worthIt.trim() || undefined,
      });
      toast.success("Personal reflection preserved!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save reflection";
      toast.error(msg);
    } finally {
      setIsSavingReflection(false);
    }
  };

  // Available items to link (not already linked)
  const linkedList = goal.linkedItems || [];
  const availableItemsToLink = allWishlistItems.filter(
    (item) => !linkedList.some((l) => l.id === item.id)
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/goals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Goals</span>
        </Link>
      </div>

      {/* Goal Header Hero */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
        {goal.coverImageUrl ? (
          <div className="h-48 sm:h-64 w-full overflow-hidden bg-slate-100 dark:bg-[#0A0B10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={goal.coverImageUrl}
              alt={goal.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isCompleted ? "emerald" : "default"}
                  className="capitalize shadow-xs"
                >
                  {goal.status}
                </Badge>
                {goal.targetDate ? (
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {goal.title}
              </h1>

              {goal.description ? (
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {goal.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
                className="gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Goal</span>
              </Button>

              <Button
                variant={isCompleted ? "secondary" : "default"}
                size="sm"
                onClick={handleToggleCompleteGoal}
                className="gap-1.5 shadow-sm shadow-indigo-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCompleted ? "Reopen Goal" : "Complete Goal"}</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Milestones Progress ({goal.completedMilestones || 0} of {goal.totalMilestones || 0} completed)
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {goal.progressPercent || 0}%
              </span>
            </div>
            <Progress value={goal.progressPercent || 0} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Milestones & Linked Wishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Milestones Checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Milestones Checklist</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {goal.completedMilestones || 0} / {goal.totalMilestones || 0}
            </span>
          </div>

          {/* Add Milestone Form */}
          <form onSubmit={handleAddMilestone} className="flex gap-2">
            <Input
              placeholder="Add next milestone (e.g. Finish CV, Book flights)..."
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              className="text-xs sm:text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isAddingMilestone || !newMilestoneTitle.trim()}
              className="shadow-sm shadow-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          {/* Milestones List */}
          {(goal.milestones || []).length > 0 ? (
            <div className="space-y-2">
              {goal.milestones!.map((m: GoalMilestone) => (
                <div
                  key={m.id}
                  className={`group flex items-center justify-between rounded-xl border p-3 transition-colors ${
                    m.isCompleted
                      ? "border-emerald-500/30 bg-emerald-50/15 dark:border-emerald-500/20 dark:bg-emerald-950/10"
                      : "border-slate-200/80 bg-white dark:border-white/[0.07] dark:bg-[#11131B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(m.id, m.isCompleted)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${
                        m.isCompleted
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-xs shadow-emerald-500/30"
                          : "border-slate-300 hover:border-indigo-500 dark:border-white/[0.15] dark:hover:border-indigo-400"
                      }`}
                    >
                      {m.isCompleted ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : null}
                    </button>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        m.isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.09] p-8 text-center">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No milestones added yet. Add your first actionable milestone above!
              </p>
            </div>
          )}
        </div>

        {/* Right: Linked Wishlist Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Linked Wishlist Items</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {(goal.linkedItems || []).length} linked
            </span>
          </div>

          {/* Link Item Form */}
          {availableItemsToLink.length > 0 ? (
            <form onSubmit={handleLinkItem} className="flex gap-2">
              <select
                className="flex h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100"
                value={selectedItemIdToLink}
                onChange={(e) => setSelectedItemIdToLink(e.target.value)}
              >
                <option value="">Select a wishlist item to link...</option>
                {availableItemsToLink.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm" disabled={!selectedItemIdToLink} className="shadow-sm shadow-indigo-500/20">
                Link
              </Button>
            </form>
          ) : null}

          {/* Linked Items List */}
          {(goal.linkedItems || []).length > 0 ? (
            <div className="space-y-2">
              {goal.linkedItems!.map((item: LinkedWishlistItem) => (
                <div
                  key={item.id || item.wishlistItemId}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 dark:border-white/[0.07] dark:bg-[#11131B]"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.imageUrl}
                        alt={item.name || "Item"}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                        <Compass className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {item.estimatedPrice ? (
                          <Money amount={item.estimatedPrice} currency={currency} />
                        ) : (
                          "Price unestimated"
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnlinkItem(item.id || item.wishlistItemId!)}
                    title="Unlink from goal"
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <Unlink className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.09] p-8 text-center">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No wishlist items linked yet. Link items needed to complete this quest.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Reflection Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Trophy className="h-5 w-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Personal Reflection & Achievement Log
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Preserve your story. When you complete a dream, reflect on why it mattered and what you learned.
        </p>

        <form onSubmit={handleSaveReflection} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              What did I achieve? *
            </label>
            <Textarea
              rows={2}
              placeholder="e.g. Reached my target savings, bought the ergonomic setup, and organized my workspace..."
              value={whatAchieved}
              onChange={(e) => setWhatAchieved(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Why was it important?
              </label>
              <Textarea
                rows={2}
                placeholder="How did this impact your life or well-being?"
                value={whyImportant}
                onChange={(e) => setWhyImportant(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                What did I learn along the way?
              </label>
              <Textarea
                rows={2}
                placeholder="Patience, budgeting discipline, consistency..."
                value={whatLearned}
                onChange={(e) => setWhatLearned(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Was it worth the effort?
            </label>
            <Input
              placeholder="100% yes, would do it again..."
              value={worthIt}
              onChange={(e) => setWorthIt(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSavingReflection || !whatAchieved.trim()} className="shadow-sm shadow-indigo-500/20">
              {isSavingReflection ? "Saving..." : "Preserve Reflection"}
            </Button>
          </div>
        </form>
      </div>

      <GoalDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        goal={goal}
        currencySymbol={currency}
      />
    </div>
  );
}
