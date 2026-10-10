import { z } from "zod";

export const wishlistItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name is too long"),
  description: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageKey: z.string().optional().nullable(),
  estimatedPrice: z.coerce.number().min(0).optional().nullable(),
  actualPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z
    .enum(["idea", "planned", "saving", "purchased", "archived"])
    .default("idea"),
  targetDate: z.string().optional().nullable(),
  purchasedAt: z.string().optional().nullable(),
  productUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  notes: z.string().max(2000).optional().nullable(),
  onVisionBoard: z.boolean().default(false),
});

export const quickAddWishlistSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name is too long"),
  estimatedPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const purchaseItemSchema = z.object({
  actualPrice: z.coerce.number().min(0).optional().nullable(),
  purchasedAt: z.string().optional().nullable(),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().max(1000).optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  coverImageKey: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  targetDate: z.string().optional().nullable(),
  targetAmount: z.coerce.number().min(0).optional().nullable(),
  monthlyContribution: z.coerce.number().min(0).optional().nullable(),
  status: z.enum(["active", "paused", "completed", "archived"]).default("active"),
  onVisionBoard: z.boolean().default(false),
});

export const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(500).optional().nullable(),
  isCompleted: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const savingsPlanSchema = z.object({
  targetAmount: z.coerce
    .number()
    .min(1, "Target amount must be greater than zero"),
  plannedMonthlyContribution: z.coerce.number().min(0).optional().nullable(),
  wishlistItemId: z.string().optional().nullable(),
  goalId: z.string().optional().nullable(),
});

export const savingsEntrySchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than zero"),
  date: z.string().optional().nullable(),
  note: z.string().max(300).optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const reflectionSchema = z.object({
  whatAchieved: z.string().min(1, "What you achieved is required").max(2000),
  whyImportant: z.string().max(2000).optional().nullable(),
  whatLearned: z.string().max(2000).optional().nullable(),
  worthIt: z.string().max(500).optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export const userPreferencesSchema = z.object({
  currency: z.enum(["IDR", "USD", "EUR", "GBP", "SGD", "JPY"]).default("IDR"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  displayName: z.string().max(80).optional().nullable(),
});

export type WishlistItemInput = z.input<typeof wishlistItemSchema>;
export type QuickAddWishlistInput = z.input<typeof quickAddWishlistSchema>;
export type GoalInput = z.input<typeof goalSchema>;
export type MilestoneInput = z.input<typeof milestoneSchema>;
export type SavingsPlanInput = z.input<typeof savingsPlanSchema>;
export type SavingsEntryInput = z.input<typeof savingsEntrySchema>;
export type CategoryInput = z.input<typeof categorySchema>;
export type ReflectionInput = z.input<typeof reflectionSchema>;
export type UserPreferencesInput = z.input<typeof userPreferencesSchema>;
