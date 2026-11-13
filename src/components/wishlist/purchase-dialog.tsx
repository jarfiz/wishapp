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
import { purchaseWishlistItem } from "@/lib/actions/wishlist";
import { type CurrencyCode } from "@/lib/money";
import { Money } from "@/components/ui/money";
import { toast } from "sonner";
import { CheckCircle2, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import type { WishlistItem } from "@/types";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: WishlistItem | null;
  currency?: CurrencyCode;
}

function PurchaseFormContent({
  item,
  currency,
  onOpenChange,
}: {
  item: WishlistItem;
  currency: CurrencyCode;
  onOpenChange: (open: boolean) => void;
}) {
  const [actualPrice, setActualPrice] = React.useState(
    item.estimatedPrice ? String(item.estimatedPrice) : ""
  );
  const [purchasedAt, setPurchasedAt] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await purchaseWishlistItem(item.id, {
        actualPrice: actualPrice ? Number(actualPrice) : null,
        purchasedAt,
      });

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });

      toast.success(`Congratulations! "${item.name}" marked as purchased! 🎉`);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to mark item as purchased";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[460px]">
      <DialogHeader>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <PartyPopper className="h-6 w-6" />
          <DialogTitle>Celebrate Purchase!</DialogTitle>
        </div>
        <DialogDescription>
          You achieved this dream! Confirm the purchase details for your achievement history.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleConfirm} className="space-y-4">
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
          <h4 className="font-semibold text-foreground text-sm">
            {item.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Original estimate:{" "}
            <span className="font-semibold text-foreground">
              {item.estimatedPrice ? (
                <Money amount={item.estimatedPrice} currency={currency} />
              ) : (
                "Not set"
              )}
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchase-price">
            Actual Purchase Price ({currency}) (Optional)
          </Label>
          <Input
            id="purchase-price"
            type="number"
            min="0"
            placeholder="Leave empty if not recorded"
            value={actualPrice}
            onChange={(e) => setActualPrice(e.target.value)}
            autoFocus
          />
          <p className="text-[11px] text-muted-foreground">
            Your original estimate will be preserved. This records your real spending.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchase-date">Purchase Date</Label>
          <Input
            id="purchase-date"
            type="date"
            value={purchasedAt}
            onChange={(e) => setPurchasedAt(e.target.value)}
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
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? "Confirming..." : "Mark as Purchased"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function PurchaseDialog({
  open,
  onOpenChange,
  item,
  currency = "IDR",
}: PurchaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && item ? (
        <PurchaseFormContent
          key={item.id}
          item={item}
          currency={currency}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </Dialog>
  );
}
