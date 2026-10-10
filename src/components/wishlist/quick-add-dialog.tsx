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
import { createWishlistItem } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Array<{ id: string; name: string }>;
  currencySymbol?: string;
}

export function QuickAddDialog({
  open,
  onOpenChange,
  categories = [],
  currencySymbol = "Rp",
}: QuickAddDialogProps) {
  const [name, setName] = React.useState("");
  const [estimatedPrice, setEstimatedPrice] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a name for your wish");
      return;
    }

    try {
      setIsLoading(true);
      await createWishlistItem({
        name: name.trim(),
        estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
        categoryId: categoryId || undefined,
        priority,
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });

      toast.success("Wish added to your collection!");
      setName("");
      setEstimatedPrice("");
      setCategoryId("");
      setPriority("medium");
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add wish";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
            <DialogTitle>Quick Add Wish</DialogTitle>
          </div>
          <DialogDescription>
            Quickly capture something you aspire to have. Only the name is required!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wish-name">What do you want? *</Label>
            <Input
              id="wish-name"
              placeholder="e.g. Ergonomic Office Chair, Sony A7 IV..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="wish-price">Estimated Price ({currencySymbol})</Label>
              <Input
                id="wish-price"
                type="number"
                min="0"
                placeholder="Optional"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wish-priority">Priority</Label>
              <select
                id="wish-priority"
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-1.5">
              <Label htmlFor="wish-category">Category</Label>
              <select
                id="wish-category"
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : "Add Wish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
