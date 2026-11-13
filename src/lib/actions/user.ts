"use server";

import { db } from "@/lib/db";
import {
  user,
  userPreferences,
  categories,
  wishlistItems,
  goals,
  goalMilestones,
  savingsPlans,
  savingsEntries,
  userAchievements,
  goalReflections,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import {
  userPreferencesSchema,
  categorySchema,
  type UserPreferencesInput,
  type CategoryInput,
} from "@/lib/validations";
import { eq, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserPreferences() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [prefs] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!prefs) {
    return {
      currency: "IDR" as const,
      theme: "system" as const,
      displayName: session.user.name || "",
    };
  }

  return {
    currency: (prefs.currency || "IDR") as "IDR" | "USD" | "EUR" | "GBP" | "SGD" | "JPY",
    theme: (prefs.theme || "system") as "light" | "dark" | "system",
    displayName: prefs.displayName || session.user.name || "",
  };
}

export async function updateUserPreferences(data: UserPreferencesInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = userPreferencesSchema.parse(data);

  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(userPreferences)
      .set({
        currency: parsed.currency,
        theme: parsed.theme,
        displayName: parsed.displayName || null,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.id, existing.id));
  } else {
    await db.insert(userPreferences).values({
      userId,
      currency: parsed.currency,
      theme: parsed.theme,
      displayName: parsed.displayName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateThemePreference(theme: "light" | "dark" | "system") {
  const session = await requireAuth();
  const userId = session.user.id;

  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(userPreferences)
      .set({
        theme,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.id, existing.id));
  } else {
    await db.insert(userPreferences).values({
      userId,
      currency: "IDR",
      theme,
      displayName: session.user.name || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function getCategories() {
  const session = await requireAuth();
  const userId = session.user.id;

  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(asc(categories.name));
}

export async function createCategory(data: CategoryInput) {
  const session = await requireAuth();
  const userId = session.user.id;

  const parsed = categorySchema.parse(data);

  const [created] = await db
    .insert(categories)
    .values({
      userId,
      name: parsed.name,
      icon: parsed.icon || null,
      color: parsed.color || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/settings");
  revalidatePath("/wishlist");
  revalidatePath("/goals");

  return created;
}

export async function deleteCategory(id: string) {
  const session = await requireAuth();
  const userId = session.user.id;

  await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)));

  revalidatePath("/settings");
  revalidatePath("/wishlist");
  revalidatePath("/goals");

  return { success: true };
}

export async function exportUserData() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [
    exportWishlist,
    exportGoals,
    exportMilestones,
    exportSavingsPlans,
    exportSavingsEntries,
    exportAchievements,
    exportReflections,
    exportCategories,
  ] = await Promise.all([
    db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId)),
    db.select().from(goals).where(eq(goals.userId, userId)),
    db.select().from(goalMilestones).where(eq(goalMilestones.userId, userId)),
    db.select().from(savingsPlans).where(eq(savingsPlans.userId, userId)),
    db.select().from(savingsEntries).where(eq(savingsEntries.userId, userId)),
    db.select().from(userAchievements).where(eq(userAchievements.userId, userId)),
    db.select().from(goalReflections).where(eq(goalReflections.userId, userId)),
    db.select().from(categories).where(eq(categories.userId, userId)),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    categories: exportCategories,
    wishlistItems: exportWishlist,
    goals: exportGoals,
    milestones: exportMilestones,
    savingsPlans: exportSavingsPlans,
    savingsEntries: exportSavingsEntries,
    achievements: exportAchievements,
    reflections: exportReflections,
  };
}

export async function deleteUserAccount() {
  const session = await requireAuth();
  const userId = session.user.id;

  await db.delete(user).where(eq(user.id, userId));
  return { success: true };
}
