"use client";

import * as React from "react";
import { formatMoney, type CurrencyCode } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Gift,
  MoreVertical,
  Check,
  Eye,
  Trash2,
  Archive,
  Edit,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  archiveWishlistItem,
  restoreWishlistItem,
  deleteWishlistItem,
  unpurchaseWishlistItem,
  toggleVisionBoardItem,
} from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WishlistItem } from "@/types";

interface WishCardProps {
  item: WishlistItem;
  currency?: CurrencyCode;
  onEdit: (item: WishlistItem) => void;
  onPurchase: (item: WishlistItem) => void;
  isCompact?: boolean;
}

export function WishCard({
  item,
  currency = "IDR",
  onEdit,
  onPurchase,
  isCompact = false,
}: WishCardProps) {
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

  const isPurchased = item.status === "purchased";
  const isArchived = item.status === "archived";

  const handleTogglePurchase = async () => {
    if (isPurchased) {
      try {
        await unpurchaseWishlistItem(item.id);
        toast.info("Marked as unpurchased");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update item";
        toast.error(msg);
      }
    } else {
      onPurchase(item);
    }
  };

  const handleArchive = async () => {
    try {
      if (isArchived) {
        await restoreWishlistItem(item.id);
        toast.success("Item restored to active wishlist");
      } else {
        await archiveWishlistItem(item.id);
        toast.success("Item archived");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      toast.error(msg);
    }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await deleteWishlistItem(item.id);
      toast.success("Item deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      toast.error(msg);
    }
    setShowMenu(false);
  };

  const handleToggleVisionBoard = async () => {
    try {
      await toggleVisionBoardItem(item.id, !item.onVisionBoard);
      toast.success(
        !item.onVisionBoard
          ? "Added to Vision Board ✨"
          : "Removed from Vision Board"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update Vision Board";
      toast.error(msg);
    }
    setShowMenu(false);
  };

  const priorityColor: "destructive" | "warning" | "secondary" =
    item.priority === "high"
      ? "destructive"
      : item.priority === "medium"
      ? "warning"
      : "secondary";

  if (isCompact) {
    return (
      <div
        className={cn(
          "group flex items-center justify-between rounded-xl border p-3.5 transition-all",
          isPurchased
            ? "border-emerald-200/60 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10"
            : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleTogglePurchase}
            title={isPurchased ? "Mark as not purchased" : "Mark as purchased"}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer",
              isPurchased
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-300 hover:border-indigo-500 dark:border-zinc-700"
            )}
          >
            {isPurchased ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
          </button>

          <div className="flex flex-col truncate">
            <span
              className={cn(
                "truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100",
                isPurchased && "line-through text-zinc-400 dark:text-zinc-500"
              )}
            >
              {item.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
                {item.estimatedPrice
                  ? formatMoney(item.estimatedPrice, currency)
                  : "Price not set"}
              </span>
              {item.targetDate ? (
                <>
                  <span>•</span>
                  <span>{new Date(item.targetDate).toLocaleDateString()}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.onVisionBoard ? (
            <Badge variant="indigo" className="gap-1 px-1.5 text-[10px]">
              <Eye className="h-3 w-3" />
            </Badge>
          ) : null}
          <button
            onClick={() => onEdit(item)}
            className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-md",
        isPurchased
          ? "border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/15"
          : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50"
      )}
    >
      {/* Top Media / Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        {item.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100/60 dark:from-zinc-900 dark:to-zinc-950 text-zinc-300 dark:text-zinc-700">
            <Gift className="h-10 w-10 stroke-[1.2] opacity-80" />
            <span className="mt-1 text-[11px] font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-600">
              Daymark Wish
            </span>
          </div>
        )}

        {/* Vision board star pill */}
        {item.onVisionBoard ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-indigo-900/80 px-2 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>Vision Board</span>
          </div>
        ) : null}

        {/* Priority Badge */}
        {item.priority && item.priority !== "medium" ? (
          <div className="absolute bottom-2.5 left-2.5">
            <Badge variant={priorityColor} className="capitalize text-[10px] py-0">
              {item.priority}
            </Badge>
          </div>
        ) : null}

        {/* Action Menu Trigger */}
        <div className="absolute top-2.5 right-2.5" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full bg-white/90 p-1.5 text-zinc-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu ? (
            <div className="absolute right-0 top-8 z-40 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(item);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-zinc-400" />
                <span>Edit Details</span>
              </button>

              <button
                onClick={handleToggleVisionBoard}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-zinc-400" />
                <span>{item.onVisionBoard ? "Remove from Board" : "Add to Board"}</span>
              </button>

              {item.productUrl ? (
                <a
                  href={item.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Visit Link</span>
                </a>
              ) : null}

              {isPurchased ? (
                <button
                  onClick={handleTogglePurchase}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Undo Purchase</span>
                </button>
              ) : null}

              <button
                onClick={handleArchive}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Archive className="h-3.5 w-3.5 text-zinc-400" />
                <span>{isArchived ? "Restore Item" : "Archive"}</span>
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

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-zinc-900 dark:text-zinc-100 text-base line-clamp-1",
                isPurchased && "line-through text-zinc-400 dark:text-zinc-500"
              )}
            >
              {item.name}
            </h3>
          </div>

          {item.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          ) : null}

          {item.notes ? (
            <p className="mt-2 text-[11px] italic text-indigo-600/90 dark:text-indigo-400 line-clamp-1">
              &ldquo;{item.notes}&rdquo;
            </p>
          ) : null}
        </div>

        {/* Footer info & Purchase Checkbox */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {isPurchased ? "Spent" : "Estimate"}
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
              {isPurchased
                ? item.actualPrice
                  ? formatMoney(item.actualPrice, currency)
                  : "Price unrecorded"
                : item.estimatedPrice
                ? formatMoney(item.estimatedPrice, currency)
                : "Price not set"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePurchase}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-xs",
              isPurchased
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-emerald-500"
            )}
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{isPurchased ? "Purchased" : "Got it!"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
