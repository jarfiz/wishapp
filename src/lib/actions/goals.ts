"use server";

import { db } from "@/lib/db";
import {
  goals,
  goalMilestones,
  goalWishlistItems,
  wishlistItems,
  goalReflections,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import {
  goalSchema,
  milestoneSchema,
  reflectionSchema,
  type GoalInput,
  type MilestoneInput,
  type ReflectionInput,
} from "@/lib/validations";
import { checkAndAwardAchievement } from "./achievements";
import { eq, and, sql, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Goal } from "@/types";

export async function getGoals(): Promise<Goal[]> {
  const session = await requireAuth();
  const userId = session.user.id;

  const userGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));

  const allMilestones = await db
    .select()
    .from(goalMilestones)
    .where(eq(goalMilestones.userId, userId))
    .orderBy(asc(goalMilestones.sortOrder));

  const allLinks = await db
    .select({
      goalId: goalWishlistItems.goalId,
      wishlistItemId: goalWishlistItems.wishlistItemId,
      name: wishlistItems.name,
      estimatedPrice: wishlistItems.estimatedPrice,
      status: wishlistItems.status,
      imageUrl: wishlistItems.imageUrl,
    })
    .from(goalWishlistItems)
    .innerJoin(
      wishlistItems,
      eq(goalWishlistItems.wishlistItemId, wishlistItems.id)
    )
    .where(eq(goalWishlistItems.userId, userId));

  return userGoals.map((g) => {
    const milestones = allMilestones.filter((m) => m.goalId === g.id);
    const linkedItems = allLinks.filter((l) => l.goalId === g.id);
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m) => m.isCompleted).length;
    const progressPercent =
      totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

    return {
      ...g,
      milestones,
      linkedItems,
      totalMilestones,
      completedMilestones,
      progressPercent,
    };
  }) as unknown as Goal[];
}

export async function getGoalById(id: string): Promise<Goal | null> {
  const session = await requireAuth();
  const userId = session.user.id;

  const [goal] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!goal) return null;

  const milestones = await db
    .select()
    .from(goalMilestones)
    .where(and(eq(goalMilestones.goalId, id), eq(goalMilestones.userId, userId)))
    .orderBy(asc(goalMilestones.sortOrder), asc(goalMilestones.createdAt));

  const linkedItems = await db
    .select({
      id: wishlistItems.id,
      name: wishlistItems.name,
      estimatedPrice: wishlistItems.estimatedPrice,
      actualPrice: wishlistItems.actualPrice,
      status: wishlistItems.status,
      imageUrl: wishlistItems.imageUrl,
    })
    .from(goalWishlistItems)
    .innerJoin(
      wishlistItems,
      eq(goalWishlistItems.wishlistItemId, wishlistItems.id)
    )
    .where(
      and(
        eq(goalWishlistItems.goalId, id),
        eq(goalWishlistItems.userId, userId)
      )
    );

  const [reflection] = await db
    .select()
    .from(goalReflections)
    .where(
      and(
        eq(goalReflections.goalId, id),
        eq(goalReflections.userId, userId)
      )
    )
    .limit(1);

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.isCompleted).length;
  const progressPercent =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  return {
    ...goal,
    milestones,
    linkedItems,
    reflection: reflection || null,
    totalMilestones,
    completedMilestones,
    progressPercent,
  } as unknown as Goal;
}

export async function createGoal(data: GoalInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = goalSchema.parse(data);

  // Check if first goal
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(goals)
    .where(eq(goals.userId, userId));

  const isFirstGoal = Number(countResult[0]?.count || 0) === 0;

  const [created] = await db
    .insert(goals)
    .values({
      userId,
      title: parsed.title,
      description: parsed.description || null,
      coverImageUrl: parsed.coverImageUrl || null,
      coverImageKey: parsed.coverImageKey || null,
      categoryId: parsed.categoryId || null,
      targetDate: parsed.targetDate ? new Date(parsed.targetDate) : null,
      targetAmount: parsed.targetAmount ? String(parsed.targetAmount) : null,
      monthlyContribution: parsed.monthlyContribution
        ? String(parsed.monthlyContribution)
        : null,
      status: parsed.status || "active",
      onVisionBoard: Boolean(parsed.onVisionBoard),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (isFirstGoal) {
    await checkAndAwardAchievement(userId, "planner");
  }

  if (parsed.onVisionBoard) {
    await checkAndAwardAchievement(userId, "visionary");
  }

  revalidatePath("/goals");
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return created;
}

export async function updateGoal(id: string, data: Partial<GoalInput>) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = goalSchema.partial().parse(data);

  const updates: Partial<typeof goals.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (parsed.title !== undefined) updates.title = parsed.title;
  if (parsed.description !== undefined) updates.description = parsed.description;
  if (parsed.coverImageUrl !== undefined) updates.coverImageUrl = parsed.coverImageUrl;
  if (parsed.coverImageKey !== undefined) updates.coverImageKey = parsed.coverImageKey;
  if (parsed.categoryId !== undefined) updates.categoryId = parsed.categoryId;
  if (parsed.targetDate !== undefined)
    updates.targetDate = parsed.targetDate ? new Date(parsed.targetDate) : null;
  if (parsed.targetAmount !== undefined)
    updates.targetAmount = parsed.targetAmount ? String(parsed.targetAmount) : null;
  if (parsed.monthlyContribution !== undefined)
    updates.monthlyContribution = parsed.monthlyContribution
      ? String(parsed.monthlyContribution)
      : null;
  if (parsed.status !== undefined) updates.status = parsed.status;
  if (parsed.onVisionBoard !== undefined) updates.onVisionBoard = parsed.onVisionBoard;

  const [updated] = await db
    .update(goals)
    .set(updates)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();

  if (parsed.onVisionBoard) {
    await checkAndAwardAchievement(userId, "visionary");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return updated;
}

export async function completeGoal(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [current] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!current) throw new Error("Goal not found");

  const [updated] = await db
    .update(goals)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();

  // Award achievements
  await checkAndAwardAchievement(userId, "dream_achieved");

  // If goal has no financial target, it is an experience-based goal
  if (!current.targetAmount || Number(current.targetAmount) === 0) {
    await checkAndAwardAchievement(userId, "explorer");
  }

  // Check total completed goals
  const completedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.status, "completed")));

  if (Number(completedCount[0]?.count || 0) >= 3) {
    await checkAndAwardAchievement(userId, "goal_crusher");
  }

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
  revalidatePath("/overview");
  revalidatePath("/achievements");

  return updated;
}

export async function reopenGoal(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(goals)
    .set({
      status: "active",
      completedAt: null,
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
  revalidatePath("/overview");
  revalidatePath("/achievements");

  return updated;
}

export async function deleteGoal(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)));

  revalidatePath("/goals");
  revalidatePath("/overview");
  revalidatePath("/vision-board");

  return { success: true };
}

// ==========================================
// Milestone Operations
// ==========================================

export async function addMilestone(goalId: string, data: MilestoneInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = milestoneSchema.parse(data);

  // Get current max order
  const existing = await db
    .select({ maxOrder: sql<number>`coalesce(max(${goalMilestones.sortOrder}), 0)` })
    .from(goalMilestones)
    .where(
      and(
        eq(goalMilestones.goalId, goalId),
        eq(goalMilestones.userId, userId)
      )
    );

  const nextOrder = Number(existing[0]?.maxOrder || 0) + 1;

  const [created] = await db
    .insert(goalMilestones)
    .values({
      goalId,
      userId,
      title: parsed.title,
      description: parsed.description || null,
      isCompleted: Boolean(parsed.isCompleted),
      sortOrder: parsed.sortOrder || nextOrder,
      completedAt: parsed.isCompleted ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/overview");

  return created;
}

export async function toggleMilestone(milestoneId: string, isCompleted: boolean) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [updated] = await db
    .update(goalMilestones)
    .set({
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(goalMilestones.id, milestoneId),
        eq(goalMilestones.userId, userId)
      )
    )
    .returning();

  if (isCompleted) {
    // Check total completed milestones across all goals
    const countCompleted = await db
      .select({ count: sql<number>`count(*)` })
      .from(goalMilestones)
      .where(
        and(
          eq(goalMilestones.userId, userId),
          eq(goalMilestones.isCompleted, true)
        )
      );

    if (Number(countCompleted[0]?.count || 0) >= 5) {
      await checkAndAwardAchievement(userId, "milestone_master");
    }
  }

  if (updated) {
    revalidatePath("/goals");
    revalidatePath(`/goals/${updated.goalId}`);
    revalidatePath("/overview");
  }

  return updated;
}

export async function deleteMilestone(milestoneId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  const [deleted] = await db
    .delete(goalMilestones)
    .where(
      and(
        eq(goalMilestones.id, milestoneId),
        eq(goalMilestones.userId, userId)
      )
    )
    .returning();

  if (deleted) {
    revalidatePath("/goals");
    revalidatePath(`/goals/${deleted.goalId}`);
  }

  return { success: true };
}

// ==========================================
// Goal & Wishlist Link Operations
// ==========================================

export async function linkWishlistItem(goalId: string, wishlistItemId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Verify ownership of both goal and item
  const [goal] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
  const [item] = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.id, wishlistItemId), eq(wishlistItems.userId, userId)));

  if (!goal || !item) {
    throw new Error("Goal or Item not found or unauthorized");
  }

  await db
    .insert(goalWishlistItems)
    .values({
      goalId,
      wishlistItemId,
      userId,
      createdAt: new Date(),
    })
    .onConflictDoNothing();

  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/goals");

  return { success: true };
}

export async function unlinkWishlistItem(goalId: string, wishlistItemId: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(goalWishlistItems)
    .where(
      and(
        eq(goalWishlistItems.goalId, goalId),
        eq(goalWishlistItems.wishlistItemId, wishlistItemId),
        eq(goalWishlistItems.userId, userId)
      )
    );

  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/goals");

  return { success: true };
}

// ==========================================
// Goal Reflection
// ==========================================

export async function saveGoalReflection(goalId: string, data: ReflectionInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = reflectionSchema.parse(data);

  // Check if already exists
  const [existing] = await db
    .select()
    .from(goalReflections)
    .where(
      and(
        eq(goalReflections.goalId, goalId),
        eq(goalReflections.userId, userId)
      )
    );

  if (existing) {
    const [updated] = await db
      .update(goalReflections)
      .set({
        whatAchieved: parsed.whatAchieved,
        whyImportant: parsed.whyImportant || null,
        whatLearned: parsed.whatLearned || null,
        worthIt: parsed.worthIt || null,
        photoUrl: parsed.photoUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(goalReflections.id, existing.id))
      .returning();

    revalidatePath(`/goals/${goalId}`);
    revalidatePath("/achievements");
    return updated;
  } else {
    const [created] = await db
      .insert(goalReflections)
      .values({
        goalId,
        userId,
        whatAchieved: parsed.whatAchieved,
        whyImportant: parsed.whyImportant || null,
        whatLearned: parsed.whatLearned || null,
        worthIt: parsed.worthIt || null,
        photoUrl: parsed.photoUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath(`/goals/${goalId}`);
    revalidatePath("/achievements");
    return created;
  }
}
