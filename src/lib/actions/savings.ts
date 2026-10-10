"use server";

import { db } from "@/lib/db";
import {
  savingsPlans,
  savingsEntries,
  wishlistItems,
  goals,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import {
  savingsPlanSchema,
  savingsEntrySchema,
  type SavingsPlanInput,
  type SavingsEntryInput,
} from "@/lib/validations";
import { calculateSavingsProjection } from "@/lib/money";
import { checkAndAwardAchievement } from "./achievements";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSavingsPlans() {
  const session = await requireAuth();
  const userId = session.user.id;

  const plans = await db
    .select({
      id: savingsPlans.id,
      userId: savingsPlans.userId,
      wishlistItemId: savingsPlans.wishlistItemId,
      goalId: savingsPlans.goalId,
      targetAmount: savingsPlans.targetAmount,
      plannedMonthlyContribution: savingsPlans.plannedMonthlyContribution,
      createdAt: savingsPlans.createdAt,
      updatedAt: savingsPlans.updatedAt,
      itemName: wishlistItems.name,
      itemImage: wishlistItems.imageUrl,
      itemEstimatedPrice: wishlistItems.estimatedPrice,
      goalTitle: goals.title,
      goalCover: goals.coverImageUrl,
    })
    .from(savingsPlans)
    .leftJoin(wishlistItems, eq(savingsPlans.wishlistItemId, wishlistItems.id))
    .leftJoin(goals, eq(savingsPlans.goalId, goals.id))
    .where(eq(savingsPlans.userId, userId))
    .orderBy(desc(savingsPlans.createdAt));

  const allEntries = await db
    .select()
    .from(savingsEntries)
    .where(eq(savingsEntries.userId, userId))
    .orderBy(desc(savingsEntries.date));

  return plans.map((plan) => {
    const entries = allEntries.filter((e) => e.planId === plan.id);
    const projection = calculateSavingsProjection(
      plan.targetAmount,
      entries,
      plan.plannedMonthlyContribution
    );

    const displayName = plan.itemName || plan.goalTitle || "Custom Savings Plan";
    const displayImage = plan.itemImage || plan.goalCover || null;

    return {
      ...plan,
      displayName,
      displayImage,
      entries,
      projection,
    };
  });
}

export async function createSavingsPlan(data: SavingsPlanInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = savingsPlanSchema.parse(data);

  // Validate that either item or goal is specified, but not both
  if (parsed.wishlistItemId && parsed.goalId) {
    throw new Error("A savings plan cannot be linked to both an item and a goal.");
  }

  const [created] = await db
    .insert(savingsPlans)
    .values({
      userId,
      wishlistItemId: parsed.wishlistItemId || null,
      goalId: parsed.goalId || null,
      targetAmount: String(parsed.targetAmount),
      plannedMonthlyContribution: parsed.plannedMonthlyContribution
        ? String(parsed.plannedMonthlyContribution)
        : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/savings");
  revalidatePath("/overview");

  return created;
}

export async function deleteSavingsPlan(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(savingsPlans)
    .where(and(eq(savingsPlans.id, id), eq(savingsPlans.userId, userId)));

  revalidatePath("/savings");
  revalidatePath("/overview");

  return { success: true };
}

export async function addSavingsEntry(planId: string, data: SavingsEntryInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = savingsEntrySchema.parse(data);

  // Verify plan ownership
  const [plan] = await db
    .select()
    .from(savingsPlans)
    .where(and(eq(savingsPlans.id, planId), eq(savingsPlans.userId, userId)));

  if (!plan) throw new Error("Savings plan not found or unauthorized");

  const [entry] = await db
    .insert(savingsEntries)
    .values({
      planId,
      userId,
      amount: String(parsed.amount),
      date: parsed.date ? new Date(parsed.date) : new Date(),
      note: parsed.note || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Check achievements:
  // 1. Consistent Saver: contributions on multiple distinct calendar dates
  const distinctDates = await db
    .select({
      distinctDate: sql<string>`distinct to_char(${savingsEntries.date}, 'YYYY-MM-DD')`,
    })
    .from(savingsEntries)
    .where(eq(savingsEntries.userId, userId));

  if (distinctDates.length >= 2) {
    await checkAndAwardAchievement(userId, "consistent_saver");
  }

  // 2. Big Saver: Saved >= 50% toward target
  const entries = await db
    .select()
    .from(savingsEntries)
    .where(eq(savingsEntries.planId, planId));

  const projection = calculateSavingsProjection(
    plan.targetAmount,
    entries,
    plan.plannedMonthlyContribution
  );

  if (projection.percentageSaved >= 50) {
    await checkAndAwardAchievement(userId, "big_saver");
  }

  revalidatePath("/savings");
  revalidatePath("/overview");

  return entry;
}

export async function deleteSavingsEntry(entryId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(savingsEntries)
    .where(
      and(
        eq(savingsEntries.id, entryId),
        eq(savingsEntries.userId, userId)
      )
    );

  revalidatePath("/savings");
  revalidatePath("/overview");

  return { success: true };
}
