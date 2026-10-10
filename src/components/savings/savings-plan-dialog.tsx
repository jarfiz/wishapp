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
import { Label } from "@/components/ui/label";
import { createSavingsPlan } from "@/lib/actions/savings";
import { toast } from "sonner";
import { PiggyBank } from "lucide-react";
import type { WishlistItem, Goal } from "@/types";

interface SavingsPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wishlistItems: WishlistItem[];
  goals: Goal[];
  currencySymbol?: string;
}

export function SavingsPlanDialog({
  open,
  onOpenChange,
  wishlistItems,
  goals,
  currencySymbol = "Rp",
}: SavingsPlanDialogProps) {
  const [targetType, setTargetType] = React.useState<"item" | "goal">("item");
  const [selectedItemId, setSelectedItemId] = React.useState("");
  const [selectedGoalId, setSelectedGoalId] = React.useState("");
  const [targetAmount, setTargetAmount] = React.useState("");
  const [plannedMonthly, setPlannedMonthly] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    const item = wishlistItems.find((i) => i.id === id);
    if (item && item.estimatedPrice) {
      setTargetAmount(String(item.estimatedPrice));
    }
  };

  const handleGoalSelect = (id: string) => {
    setSelectedGoalId(id);
    const goal = goals.find((g) => g.id === id);
    if (goal && goal.targetAmount) {
      setTargetAmount(String(goal.targetAmount));
    }
    if (goal && goal.monthlyContribution) {
      setPlannedMonthly(String(goal.monthlyContribution));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAmount || Number(targetAmount) <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    try {
      setIsSubmitting(true);
      await createSavingsPlan({
        targetAmount: Number(targetAmount),
        plannedMonthlyContribution: plannedMonthly ? Number(plannedMonthly) : null,
        wishlistItemId: targetType === "item" ? selectedItemId || null : null,
        goalId: targetType === "goal" ? selectedGoalId || null : null,
      });

      toast.success("Savings plan created!");
      setTargetAmount("");
      setPlannedMonthly("");
      setSelectedItemId("");
      setSelectedGoalId("");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create savings plan";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <PiggyBank className="h-5 w-5" />
            <DialogTitle>Create Savings Plan</DialogTitle>
          </div>
          <DialogDescription>
            Set up an intentional savings target and monthly projection for a wish or goal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>What are you saving for?</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetType("item")}
                className={`rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer ${
                  targetType === "item"
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/70"
                }`}
              >
                Wishlist Item
              </button>
              <button
                type="button"
                onClick={() => setTargetType("goal")}
                className={`rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer ${
                  targetType === "goal"
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/70"
                }`}
              >
                Life Goal
              </button>
            </div>
          </div>

          {targetType === "item" ? (
            <div className="space-y-1.5">
              <Label htmlFor="plan-item">Select Wishlist Item</Label>
              <select
                id="plan-item"
                className="flex h-10 w-full rounded-xl border border-input bg-card/60 backdrop-blur-sm px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-foreground cursor-pointer"
                value={selectedItemId}
                onChange={(e) => handleItemSelect(e.target.value)}
              >
                <option value="">Choose an item...</option>
                {wishlistItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="plan-goal">Select Life Goal</Label>
              <select
                id="plan-goal"
                className="flex h-10 w-full rounded-xl border border-input bg-card/60 backdrop-blur-sm px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-foreground cursor-pointer"
                value={selectedGoalId}
                onChange={(e) => handleGoalSelect(e.target.value)}
              >
                <option value="">Choose a goal...</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="plan-target">
              Target Amount ({currencySymbol}) *
            </Label>
            <Input
              id="plan-target"
              type="number"
              min="1"
              placeholder="e.g. 5000000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-monthly">
              Planned Monthly Contribution ({currencySymbol}) (Optional)
            </Label>
            <Input
              id="plan-monthly"
              type="number"
              min="1"
              placeholder="e.g. 500000"
              value={plannedMonthly}
              onChange={(e) => setPlannedMonthly(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Used to calculate projected months to target.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting || !targetAmount}
            >
              {isSubmitting ? "Creating..." : "Start Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
