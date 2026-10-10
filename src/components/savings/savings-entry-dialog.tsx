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
import { addSavingsEntry } from "@/lib/actions/savings";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import confetti from "canvas-confetti";
import type { SavingsPlan } from "@/types";

interface SavingsEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SavingsPlan | null;
  currencySymbol?: string;
}

export function SavingsEntryDialog({
  open,
  onOpenChange,
  plan,
  currencySymbol = "Rp",
}: SavingsEntryDialogProps) {
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount saved");
      return;
    }

    try {
      setIsSubmitting(true);
      await addSavingsEntry(plan.id, {
        amount: Number(amount),
        date,
        note: note.trim() || undefined,
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });

      toast.success("Contribution recorded! Keep going! 💰");
      setAmount("");
      setNote("");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record contribution";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Coins className="h-5 w-5" />
            <DialogTitle>Record Contribution</DialogTitle>
          </div>
          <DialogDescription>
            Add money set aside toward &ldquo;{plan.displayName}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="entry-amount">
              Amount Saved ({currencySymbol}) *
            </Label>
            <Input
              id="entry-amount"
              type="number"
              min="1"
              placeholder="e.g. 500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entry-date">Date</Label>
            <Input
              id="entry-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="entry-note">Note (Optional)</Label>
            <Input
              id="entry-note"
              placeholder="e.g. October paycheck, freelance bonus..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? "Recording..." : "Record Contribution"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
