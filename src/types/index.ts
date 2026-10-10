import type { CurrencyCode } from "@/lib/money";

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type WishlistPriority = "low" | "medium" | "high";
export type WishlistStatus = "idea" | "planned" | "saving" | "purchased" | "archived";

export interface WishlistItem {
  id: string;
  userId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  imageKey?: string | null;
  estimatedPrice?: string | null;
  actualPrice?: string | null;
  priority: WishlistPriority;
  status: WishlistStatus;
  targetDate?: Date | null;
  purchasedAt?: Date | null;
  productUrl?: string | null;
  notes?: string | null;
  onVisionBoard: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalStatus = "active" | "paused" | "completed" | "archived";

export interface GoalMilestone {
  id: string;
  goalId: string;
  userId: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  sortOrder: number;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalReflection {
  id: string;
  goalId: string;
  userId: string;
  whatAchieved: string;
  whyImportant?: string | null;
  whatLearned?: string | null;
  worthIt?: string | null;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedWishlistItem {
  id?: string;
  goalId?: string;
  wishlistItemId?: string;
  name?: string;
  estimatedPrice?: string | null;
  actualPrice?: string | null;
  status?: string;
  imageUrl?: string | null;
}

export interface Goal {
  id: string;
  userId: string;
  categoryId?: string | null;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  coverImageKey?: string | null;
  status: GoalStatus;
  targetDate?: Date | null;
  targetAmount?: string | null;
  monthlyContribution?: string | null;
  onVisionBoard: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  milestones?: GoalMilestone[];
  linkedItems?: LinkedWishlistItem[];
  reflection?: GoalReflection | null;
  totalMilestones?: number;
  completedMilestones?: number;
  progressPercent?: number;
}

export interface SavingsEntry {
  id: string;
  planId: string;
  userId: string;
  amount: string;
  date: Date;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsPlan {
  id: string;
  userId: string;
  wishlistItemId?: string | null;
  goalId?: string | null;
  targetAmount: string;
  plannedMonthlyContribution?: string | null;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  displayImage?: string | null;
  entries: SavingsEntry[];
  projection: {
    targetAmount: number;
    totalSaved: number;
    remainingAmount: number;
    percentageSaved: number;
    monthlyContribution: number | null;
    monthsRemaining: number | null;
    isComplete: boolean;
  };
}

export interface UserPreferences {
  currency: CurrencyCode;
  theme: "light" | "dark" | "system";
  displayName?: string | null;
}

export interface UserAchievementRecord {
  id?: string;
  userId?: string;
  achievementKey: string;
  unlockedAt: Date | string;
  xpEarned: number;
}
