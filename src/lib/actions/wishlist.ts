"use server";

import { db } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import {
  wishlistItemSchema,
  type WishlistItemInput,
  type QuickAddWishlistInput,
} from "@/lib/validations";
import { checkAndAwardAchievement } from "./achievements";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { WishlistItem } from "@/types";

export async function getWishlistItems(filters?: {
  categoryId?: string;
  status?: string;
  priority?: string;
  search?: string;
  onVisionBoard?: boolean;
  sortBy?: "recent" | "targetDate" | "priceAsc" | "priceDesc" | "priority" | "name";
}): Promise<WishlistItem[]> {
  const session = await requireAuth();
  const userId = session.user.id;

  let query = db
    .select()
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId))
    .$dynamic();

  // Sort orders
  const sortBy = filters?.sortBy || "recent";
  if (sortBy === "recent") {
    query = query.orderBy(desc(wishlistItems.createdAt));
  } else if (sortBy === "targetDate") {
    query = query.orderBy(asc(wishlistItems.targetDate), desc(wishlistItems.createdAt));
  } else if (sortBy === "priceAsc") {
    query = query.orderBy(asc(wishlistItems.estimatedPrice));
  } else if (sortBy === "priceDesc") {
    query = query.orderBy(desc(wishlistItems.estimatedPrice));
  } else if (sortBy === "name") {
    query = query.orderBy(asc(wishlistItems.name));
  }

  const items = await query;

  // In-memory or precise filtering for search and filters
  return items.filter((item) => {
    if (filters?.categoryId && item.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters?.status && filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters?.priority && filters.priority !== "all" && item.priority !== filters.priority) {
      return false;
    }
    if (filters?.onVisionBoard !== undefined && item.onVisionBoard !== filters.onVisionBoard) {
      return false;
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchNotes) return false;
    }
    return true;
  }) as unknown as WishlistItem[];
}

export async function createWishlistItem(data: WishlistItemInput | QuickAddWishlistInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = wishlistItemSchema.partial().parse(data);

  // Check if this is the first wishlist item for the user
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId));

  const isFirstItem = Number(countResult[0]?.count || 0) === 0;

  const [created] = await db
    .insert(wishlistItems)
    .values({
      userId,
      name: parsed.name!,
      description: parsed.description || null,
      imageUrl: parsed.imageUrl || null,
      imageKey: parsed.imageKey || null,
      estimatedPrice: parsed.estimatedPrice ? String(parsed.estimatedPrice) : null,
      actualPrice: parsed.actualPrice ? String(parsed.actualPrice) : null,
      categoryId: parsed.categoryId || null,
      priority: parsed.priority || "medium",
      status: parsed.status || "idea",
      targetDate: parsed.targetDate ? new Date(parsed.targetDate) : null,
      productUrl: parsed.productUrl || null,
      notes: parsed.notes || null,
      onVisionBoard: Boolean(parsed.onVisionBoard),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (isFirstItem) {
    await checkAndAwardAchievement(userId, "first_step");
  }

  if (parsed.onVisionBoard) {
    await checkAndAwardAchievement(userId, "visionary");
  }

  revalidatePath("/wishlist");
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return created;
}

export async function updateWishlistItem(id: string, data: Partial<WishlistItemInput>) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = wishlistItemSchema.partial().parse(data);

  const updates: Partial<typeof wishlistItems.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.name !== undefined) updates.name = parsed.name;
  if (parsed.description !== undefined) updates.description = parsed.description;
  if (parsed.imageUrl !== undefined) updates.imageUrl = parsed.imageUrl;
  if (parsed.imageKey !== undefined) updates.imageKey = parsed.imageKey;
  if (parsed.estimatedPrice !== undefined)
    updates.estimatedPrice = parsed.estimatedPrice ? String(parsed.estimatedPrice) : null;
  if (parsed.actualPrice !== undefined)
    updates.actualPrice = parsed.actualPrice ? String(parsed.actualPrice) : null;
  if (parsed.categoryId !== undefined) updates.categoryId = parsed.categoryId;
  if (parsed.priority !== undefined) updates.priority = parsed.priority;
  if (parsed.status !== undefined) updates.status = parsed.status;
  if (parsed.targetDate !== undefined)
    updates.targetDate = parsed.targetDate ? new Date(parsed.targetDate) : null;
  if (parsed.productUrl !== undefined) updates.productUrl = parsed.productUrl;
  if (parsed.notes !== undefined) updates.notes = parsed.notes;
  if (parsed.onVisionBoard !== undefined) updates.onVisionBoard = parsed.onVisionBoard;

  const [updated] = await db
    .update(wishlistItems)
    .set(updates)
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  if (parsed.onVisionBoard) {
    await checkAndAwardAchievement(userId, "visionary");
  }

  revalidatePath("/wishlist");
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return updated;
}

export async function purchaseWishlistItem(
  id: string,
  data?: { actualPrice?: number | null; purchasedAt?: string | null }
) {
  const session = await requireAuth();
  const userId = session.user.id;

  const actualPrice = data?.actualPrice;
  const purchasedAt = data?.purchasedAt;

  const [updated] = await db
    .update(wishlistItems)
    .set({
      status: "purchased",
      purchasedAt: purchasedAt ? new Date(purchasedAt) : new Date(),
      actualPrice: actualPrice ? String(actualPrice) : null,
      updatedAt: new Date(),
    })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  // Award first_purchase achievement
  await checkAndAwardAchievement(userId, "first_purchase");

  revalidatePath("/wishlist");
  revalidatePath("/overview");
  revalidatePath("/achievements");

  return updated;
}

export async function unpurchaseWishlistItem(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(wishlistItems)
    .set({
      status: "planned",
      purchasedAt: null,
      actualPrice: null,
      updatedAt: new Date(),
    })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  revalidatePath("/wishlist");
  revalidatePath("/overview");
  revalidatePath("/achievements");

  return updated;
}

export async function archiveWishlistItem(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(wishlistItems)
    .set({
      status: "archived",
      updatedAt: new Date(),
    })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  revalidatePath("/wishlist");
  revalidatePath("/overview");

  return updated;
}

export async function restoreWishlistItem(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(wishlistItems)
    .set({
      status: "planned",
      updatedAt: new Date(),
    })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  revalidatePath("/wishlist");
  revalidatePath("/overview");

  return updated;
}

export async function deleteWishlistItem(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)));

  revalidatePath("/wishlist");
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return { success: true };
}

export async function toggleVisionBoardItem(id: string, onVisionBoard: boolean) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(wishlistItems)
    .set({
      onVisionBoard,
      updatedAt: new Date(),
    })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)))
    .returning();

  if (onVisionBoard) {
    await checkAndAwardAchievement(userId, "visionary");
  }

  revalidatePath("/wishlist");
  revalidatePath("/vision-board");

  return updated;
}
