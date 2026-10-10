CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_reflections" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"user_id" text NOT NULL,
	"what_achieved" text NOT NULL,
	"why_important" text,
	"what_learned" text,
	"worth_it" text,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "goal_reflections_goal_id_unique" UNIQUE("goal_id")
);
--> statement-breakpoint
CREATE TABLE "goal_wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"wishlist_item_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text,
	"title" text NOT NULL,
	"description" text,
	"cover_image_url" text,
	"cover_image_key" text,
	"status" text DEFAULT 'active' NOT NULL,
	"target_date" timestamp,
	"target_amount" numeric(15, 2),
	"monthly_contribution" numeric(15, 2),
	"on_vision_board" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wishlist_item_id" text,
	"goal_id" text,
	"target_amount" numeric(15, 2) NOT NULL,
	"planned_monthly_contribution" numeric(15, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"achievement_key" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"image_key" text,
	"estimated_price" numeric(15, 2),
	"actual_price" numeric(15, 2),
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'idea' NOT NULL,
	"target_date" timestamp,
	"purchased_at" timestamp,
	"product_url" text,
	"notes" text,
	"on_vision_board" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_milestones" ADD CONSTRAINT "goal_milestones_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_milestones" ADD CONSTRAINT "goal_milestones_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_reflections" ADD CONSTRAINT "goal_reflections_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_reflections" ADD CONSTRAINT "goal_reflections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_wishlist_items" ADD CONSTRAINT "goal_wishlist_items_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_wishlist_items" ADD CONSTRAINT "goal_wishlist_items_wishlist_item_id_wishlist_items_id_fk" FOREIGN KEY ("wishlist_item_id") REFERENCES "public"."wishlist_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_wishlist_items" ADD CONSTRAINT "goal_wishlist_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_plan_id_savings_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."savings_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_plans" ADD CONSTRAINT "savings_plans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_plans" ADD CONSTRAINT "savings_plans_wishlist_item_id_wishlist_items_id_fk" FOREIGN KEY ("wishlist_item_id") REFERENCES "public"."wishlist_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_plans" ADD CONSTRAINT "savings_plans_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "categories_user_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_name_idx" ON "categories" USING btree ("user_id","name");--> statement-breakpoint
CREATE INDEX "goal_milestones_goal_idx" ON "goal_milestones" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "goal_milestones_user_idx" ON "goal_milestones" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goal_reflections_user_idx" ON "goal_reflections" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "goal_wishlist_unique_idx" ON "goal_wishlist_items" USING btree ("goal_id","wishlist_item_id");--> statement-breakpoint
CREATE INDEX "goal_wishlist_user_idx" ON "goal_wishlist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_user_idx" ON "goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_status_idx" ON "goals" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "goals_vision_board_idx" ON "goals" USING btree ("user_id","on_vision_board");--> statement-breakpoint
CREATE INDEX "savings_entries_plan_idx" ON "savings_entries" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "savings_entries_user_idx" ON "savings_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "savings_plans_user_idx" ON "savings_plans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "savings_plans_item_idx" ON "savings_plans" USING btree ("wishlist_item_id");--> statement-breakpoint
CREATE INDEX "savings_plans_goal_idx" ON "savings_plans" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_achievements_unique_idx" ON "user_achievements" USING btree ("user_id","achievement_key");--> statement-breakpoint
CREATE INDEX "user_achievements_user_idx" ON "user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "wishlist_user_idx" ON "wishlist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wishlist_category_idx" ON "wishlist_items" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "wishlist_status_idx" ON "wishlist_items" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "wishlist_vision_board_idx" ON "wishlist_items" USING btree ("user_id","on_vision_board");