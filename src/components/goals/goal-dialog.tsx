"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import { toast } from "sonner";
import { Compass, UploadCloud, X } from "lucide-react";
import confetti from "canvas-confetti";
import type { Goal, Category } from "@/types";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  categories?: Category[];
  currencySymbol?: string;
}

function GoalDialogForm({
  goal,
  categories,
  currencySymbol,
  onOpenChange,
}: {
  goal?: Goal | null;
  categories: Category[];
  currencySymbol: string;
  onOpenChange: (open: boolean) => void;
}) {
  const isEditing = Boolean(goal);

  const [title, setTitle] = React.useState(goal?.title || "");
  const [description, setDescription] = React.useState(goal?.description || "");
  const [coverImageUrl, setCoverImageUrl] = React.useState<string | null>(goal?.coverImageUrl || null);
  const [coverImageKey, setCoverImageKey] = React.useState<string | null>(goal?.coverImageKey || null);
  const [categoryId, setCategoryId] = React.useState(goal?.categoryId || "");
  const [targetDate, setTargetDate] = React.useState(
    goal?.targetDate
      ? new Date(goal.targetDate).toISOString().split("T")[0]
      : ""
  );
  const [targetAmount, setTargetAmount] = React.useState(
    goal?.targetAmount ? String(goal.targetAmount) : ""
  );
  const [monthlyContribution, setMonthlyContribution] = React.useState(
    goal?.monthlyContribution ? String(goal.monthlyContribution) : ""
  );
  const [status, setStatus] = React.useState<"active" | "paused" | "completed" | "archived">(
    goal?.status || "active"
  );
  const [onVisionBoard, setOnVisionBoard] = React.useState(Boolean(goal?.onVisionBoard));

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setCoverImageUrl(data.url);
      setCoverImageKey(data.key);
      toast.success("Cover image uploaded!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Goal title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        coverImageUrl: coverImageUrl || null,
        coverImageKey: coverImageKey || null,
        categoryId: categoryId || null,
        targetDate: targetDate || null,
        targetAmount: targetAmount ? Number(targetAmount) : null,
        monthlyContribution: monthlyContribution ? Number(monthlyContribution) : null,
        status,
        onVisionBoard,
      };

      if (isEditing && goal) {
        await updateGoal(goal.id, payload);
        toast.success("Goal updated successfully!");
      } else {
        await createGoal(payload);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
        toast.success("New goal created! Let's work toward it! 🚀");
      }

      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save goal";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[560px]">
      <DialogHeader>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Compass className="h-5 w-5" />
          <DialogTitle>{isEditing ? "Edit Goal" : "Create Life Quest or Goal"}</DialogTitle>
        </div>
        <DialogDescription>
          Group dreams into larger milestones, experiences, or life achievements.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Cover image */}
        <div className="space-y-1.5">
          <Label>Cover Image</Label>
          {coverImageUrl ? (
            <div className="relative group rounded-2xl overflow-hidden border border-border/80 h-36 w-full bg-muted/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt="Goal cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImageUrl(null);
                  setCoverImageKey(null);
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-28 w-full rounded-2xl border border-dashed border-border/80 hover:border-indigo-500/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
              <UploadCloud className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">
                {isUploading ? "Uploading..." : "Upload cover image (optional)"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="goal-title">Title *</Label>
          <Input
            id="goal-title"
            placeholder="e.g. Build My Dream Setup, Visit Japan, Learn Japanese..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="goal-desc">Description</Label>
          <Textarea
            id="goal-desc"
            rows={2}
            placeholder="What does achieving this goal mean to you?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="goal-target-date">Target Date</Label>
            <Input
              id="goal-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-status">Status</Label>
            <select
              id="goal-status"
              className="flex h-10 w-full rounded-xl border border-input bg-card/60 backdrop-blur-sm px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-foreground cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "paused" | "completed" | "archived")}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="goal-target-amount">
              Financial Target ({currencySymbol}) (Optional)
            </Label>
            <Input
              id="goal-target-amount"
              type="number"
              min="0"
              placeholder="Leave blank for experience goals"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-monthly">
              Monthly Savings Goal ({currencySymbol}) (Optional)
            </Label>
            <Input
              id="goal-monthly"
              type="number"
              min="0"
              placeholder="Optional"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-1.5">
            <Label htmlFor="goal-cat">Category</Label>
            <select
              id="goal-cat"
              className="flex h-10 w-full rounded-xl border border-input bg-card/60 backdrop-blur-sm px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-foreground cursor-pointer"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="goal-vision-board"
            checked={onVisionBoard}
            onChange={(e) => setOnVisionBoard(e.target.checked)}
            className="h-4 w-4 rounded-md border-border text-indigo-600 focus:ring-indigo-500/30 dark:bg-card cursor-pointer"
          />
          <Label htmlFor="goal-vision-board" className="cursor-pointer text-xs sm:text-sm font-normal text-muted-foreground hover:text-foreground transition-colors">
            Feature this goal on my Vision Board
          </Label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Goal"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  categories = [],
  currencySymbol = "Rp",
}: GoalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <GoalDialogForm
          key={goal?.id ?? "new-goal"}
          goal={goal}
          categories={categories}
          currencySymbol={currencySymbol}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </Dialog>
  );
}
