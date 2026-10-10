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
import { createWishlistItem, updateWishlistItem } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import confetti from "canvas-confetti";
import type { WishlistItem, Category } from "@/types";

interface WishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: WishlistItem | null;
  categories?: Category[];
  currencySymbol?: string;
}

function WishDialogForm({
  item,
  categories,
  currencySymbol,
  onOpenChange,
}: {
  item?: WishlistItem | null;
  categories: Category[];
  currencySymbol: string;
  onOpenChange: (open: boolean) => void;
}) {
  const isEditing = Boolean(item);

  const [name, setName] = React.useState(item?.name || "");
  const [description, setDescription] = React.useState(item?.description || "");
  const [estimatedPrice, setEstimatedPrice] = React.useState(
    item?.estimatedPrice ? String(item.estimatedPrice) : ""
  );
  const [actualPrice, setActualPrice] = React.useState(
    item?.actualPrice ? String(item.actualPrice) : ""
  );
  const [categoryId, setCategoryId] = React.useState(item?.categoryId || "");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">(
    item?.priority || "medium"
  );
  const [status, setStatus] = React.useState<"idea" | "planned" | "saving" | "purchased" | "archived">(
    item?.status || "idea"
  );
  const [targetDate, setTargetDate] = React.useState(
    item?.targetDate
      ? new Date(item.targetDate).toISOString().split("T")[0]
      : ""
  );
  const [productUrl, setProductUrl] = React.useState(item?.productUrl || "");
  const [notes, setNotes] = React.useState(item?.notes || "");
  const [onVisionBoard, setOnVisionBoard] = React.useState(Boolean(item?.onVisionBoard));
  const [imageUrl, setImageUrl] = React.useState<string | null>(item?.imageUrl || null);
  const [imageKey, setImageKey] = React.useState<string | null>(item?.imageKey || null);

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
      setImageUrl(data.url);
      setImageKey(data.key);
      toast.success("Image uploaded!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl || null,
        imageKey: imageKey || null,
        estimatedPrice: estimatedPrice ? Number(estimatedPrice) : null,
        actualPrice: actualPrice ? Number(actualPrice) : null,
        categoryId: categoryId || null,
        priority,
        status,
        targetDate: targetDate ? targetDate : null,
        productUrl: productUrl.trim() || null,
        notes: notes.trim() || null,
        onVisionBoard,
      };

      if (isEditing && item) {
        await updateWishlistItem(item.id, payload);
        toast.success("Wish updated successfully!");
      } else {
        await createWishlistItem(payload);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
        toast.success("Wish added to your collection!");
      }

      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save wish";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Wish" : "Add New Wish"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update details, photos, or timeline for this dream."
            : "Capture your wish with as much or as little detail as you want."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Image Upload Area */}
        <div className="space-y-1.5">
          <Label>Wish Image</Label>
          {imageUrl ? (
            <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-44 w-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Wish preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  setImageKey(null);
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full cursor-pointer transition-opacity"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 w-full rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-indigo-400 bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-500 dark:text-zinc-400">
                <UploadCloud className="h-7 w-7 mb-2 text-zinc-400" />
                <p className="text-xs font-medium">
                  {isUploading ? "Uploading image..." : "Upload photo (optional, up to 5MB)"}
                </p>
              </div>
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
          <Label htmlFor="edit-name">Name *</Label>
          <Input
            id="edit-name"
            placeholder="e.g. Ergonomic Office Chair"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-estimated-price">
              Estimated Price ({currencySymbol})
            </Label>
            <Input
              id="edit-estimated-price"
              type="number"
              min="0"
              placeholder="Optional"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-target-date">Target Date</Label>
            <Input
              id="edit-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-category">Category</Label>
            <select
              id="edit-category"
              className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-priority">Priority</Label>
            <select
              id="edit-priority"
              className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-status">Status</Label>
            <select
              id="edit-status"
              className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              value={status}
              onChange={(e) => setStatus(e.target.value as "idea" | "planned" | "saving" | "purchased" | "archived")}
            >
              <option value="idea">Idea</option>
              <option value="planned">Planned</option>
              <option value="saving">Saving</option>
              <option value="purchased">Purchased</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {status === "purchased" ? (
          <div className="space-y-1.5 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
            <Label htmlFor="edit-actual-price" className="text-emerald-800 dark:text-emerald-300">
              Actual Purchase Price ({currencySymbol})
            </Label>
            <Input
              id="edit-actual-price"
              type="number"
              min="0"
              placeholder="How much was actually spent?"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="edit-url">Product or Store URL</Label>
          <Input
            id="edit-url"
            type="url"
            placeholder="https://..."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-desc">Description</Label>
          <Textarea
            id="edit-desc"
            rows={2}
            placeholder="Model, color, specs, or where to buy..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-notes">Personal Reason / Why This Matters</Label>
          <Textarea
            id="edit-notes"
            rows={2}
            placeholder="Why do you want this? How will it improve your life?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="edit-vision-board"
            checked={onVisionBoard}
            onChange={(e) => setOnVisionBoard(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="edit-vision-board" className="cursor-pointer text-xs sm:text-sm font-normal">
            Feature this dream on my Vision Board
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
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Wish"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function WishDialog({
  open,
  onOpenChange,
  item,
  categories = [],
  currencySymbol = "Rp",
}: WishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <WishDialogForm
          key={item?.id ?? "new-wish"}
          item={item}
          categories={categories}
          currencySymbol={currencySymbol}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </Dialog>
  );
}
