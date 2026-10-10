import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// Better Auth Core Tables
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_idx").on(table.userId),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("account_user_idx").on(table.userId),
  ]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
  ]
);

// ==========================================
// Application Tables
// ==========================================

export const userPreferences = pgTable("user_preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  currency: text("currency").notNull().default("IDR"),
  theme: text("theme").notNull().default("system"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    icon: text("icon"),
    color: text("color"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("categories_user_idx").on(table.userId),
    uniqueIndex("categories_user_name_idx").on(table.userId, table.name),
  ]
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    imageKey: text("image_key"),
    estimatedPrice: numeric("estimated_price", { precision: 15, scale: 2 }),
    actualPrice: numeric("actual_price", { precision: 15, scale: 2 }),
    priority: text("priority").notNull().default("medium"), // 'low' | 'medium' | 'high'
    status: text("status").notNull().default("idea"), // 'idea' | 'planned' | 'saving' | 'purchased' | 'archived'
    targetDate: timestamp("target_date"),
    purchasedAt: timestamp("purchased_at"),
    productUrl: text("product_url"),
    notes: text("notes"),
    onVisionBoard: boolean("on_vision_board").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("wishlist_user_idx").on(table.userId),
    index("wishlist_category_idx").on(table.categoryId),
    index("wishlist_status_idx").on(table.userId, table.status),
    index("wishlist_vision_board_idx").on(table.userId, table.onVisionBoard),
  ]
);

export const goals = pgTable(
  "goals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    coverImageKey: text("cover_image_key"),
    status: text("status").notNull().default("active"), // 'active' | 'paused' | 'completed' | 'archived'
    targetDate: timestamp("target_date"),
    targetAmount: numeric("target_amount", { precision: 15, scale: 2 }),
    monthlyContribution: numeric("monthly_contribution", { precision: 15, scale: 2 }),
    onVisionBoard: boolean("on_vision_board").notNull().default(false),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("goals_user_idx").on(table.userId),
    index("goals_status_idx").on(table.userId, table.status),
    index("goals_vision_board_idx").on(table.userId, table.onVisionBoard),
  ]
);

export const goalMilestones = pgTable(
  "goal_milestones",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    goalId: text("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    isCompleted: boolean("is_completed").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("goal_milestones_goal_idx").on(table.goalId),
    index("goal_milestones_user_idx").on(table.userId),
  ]
);

export const goalWishlistItems = pgTable(
  "goal_wishlist_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    goalId: text("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    wishlistItemId: text("wishlist_item_id")
      .notNull()
      .references(() => wishlistItems.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("goal_wishlist_unique_idx").on(table.goalId, table.wishlistItemId),
    index("goal_wishlist_user_idx").on(table.userId),
  ]
);

export const savingsPlans = pgTable(
  "savings_plans",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    wishlistItemId: text("wishlist_item_id").references(() => wishlistItems.id, {
      onDelete: "cascade",
    }),
    goalId: text("goal_id").references(() => goals.id, {
      onDelete: "cascade",
    }),
    targetAmount: numeric("target_amount", { precision: 15, scale: 2 }).notNull(),
    plannedMonthlyContribution: numeric("planned_monthly_contribution", {
      precision: 15,
      scale: 2,
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("savings_plans_user_idx").on(table.userId),
    index("savings_plans_item_idx").on(table.wishlistItemId),
    index("savings_plans_goal_idx").on(table.goalId),
  ]
);

export const savingsEntries = pgTable(
  "savings_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    planId: text("plan_id")
      .notNull()
      .references(() => savingsPlans.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
    date: timestamp("date").notNull().defaultNow(),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("savings_entries_plan_idx").on(table.planId),
    index("savings_entries_user_idx").on(table.userId),
  ]
);

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    achievementKey: text("achievement_key").notNull(),
    unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
    xpEarned: integer("xp_earned").notNull().default(0),
  },
  (table) => [
    uniqueIndex("user_achievements_unique_idx").on(table.userId, table.achievementKey),
    index("user_achievements_user_idx").on(table.userId),
  ]
);

export const goalReflections = pgTable(
  "goal_reflections",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    goalId: text("goal_id")
      .notNull()
      .unique()
      .references(() => goals.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    whatAchieved: text("what_achieved").notNull(),
    whyImportant: text("why_important"),
    whatLearned: text("what_learned"),
    worthIt: text("worth_it"),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("goal_reflections_user_idx").on(table.userId),
  ]
);

// ==========================================
// Drizzle Relations
// ==========================================

export const userRelations = relations(user, ({ one, many }) => ({
  preferences: one(userPreferences, {
    fields: [user.id],
    references: [userPreferences.userId],
  }),
  wishlistItems: many(wishlistItems),
  goals: many(goals),
  categories: many(categories),
  savingsPlans: many(savingsPlans),
  achievements: many(userAchievements),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(user, {
    fields: [categories.userId],
    references: [user.id],
  }),
  wishlistItems: many(wishlistItems),
  goals: many(goals),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one, many }) => ({
  user: one(user, {
    fields: [wishlistItems.userId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [wishlistItems.categoryId],
    references: [categories.id],
  }),
  savingsPlans: many(savingsPlans),
  goalAssociations: many(goalWishlistItems),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(user, {
    fields: [goals.userId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [goals.categoryId],
    references: [categories.id],
  }),
  milestones: many(goalMilestones),
  wishlistAssociations: many(goalWishlistItems),
  savingsPlans: many(savingsPlans),
  reflection: one(goalReflections, {
    fields: [goals.id],
    references: [goalReflections.goalId],
  }),
}));

export const goalMilestonesRelations = relations(goalMilestones, ({ one }) => ({
  goal: one(goals, {
    fields: [goalMilestones.goalId],
    references: [goals.id],
  }),
}));

export const goalWishlistItemsRelations = relations(goalWishlistItems, ({ one }) => ({
  goal: one(goals, {
    fields: [goalWishlistItems.goalId],
    references: [goals.id],
  }),
  wishlistItem: one(wishlistItems, {
    fields: [goalWishlistItems.wishlistItemId],
    references: [wishlistItems.id],
  }),
}));

export const savingsPlansRelations = relations(savingsPlans, ({ one, many }) => ({
  user: one(user, {
    fields: [savingsPlans.userId],
    references: [user.id],
  }),
  wishlistItem: one(wishlistItems, {
    fields: [savingsPlans.wishlistItemId],
    references: [wishlistItems.id],
  }),
  goal: one(goals, {
    fields: [savingsPlans.goalId],
    references: [goals.id],
  }),
  entries: many(savingsEntries),
}));

export const savingsEntriesRelations = relations(savingsEntries, ({ one }) => ({
  plan: one(savingsPlans, {
    fields: [savingsEntries.planId],
    references: [savingsPlans.id],
  }),
}));
