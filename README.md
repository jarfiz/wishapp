# Daymark — Personal Wishlist, Life-Goal Planner & Achievement Workspace

> *"Dream about it. Plan for it. Work toward it. Achieve it."*

**Daymark** is a full-stack personal wishlist, life-goal planner, savings tracker, and achievement workspace built for intentional living. It helps you collect the things you aspire to have, estimate costs without friction, organize dreams into life quests, plan realistic monthly savings, and celebrate milestone achievements.

---

## 🌟 Key Features

### 1. Frictionless Wishlist
- **Zero-Friction Quick Add**: Create a wishlist item in seconds with just a name. No price, category, or photo required up front.
- **Detailed Planning**: Add estimated prices, target dates, product URLs, priority levels, categories, and personal reflections on why the item matters.
- **UploadThing Cloud Storage**: Upload photos (up to 4MB) powered by UploadThing CDN, with graceful local storage fallback for offline development.
- **Purchase Celebration**: Mark items as purchased with celebratory confetti while preserving your original price estimates and recording real spending.

### 2. Financial Dashboard & Overview
- **Active Wishlist Value**: Total estimated cost of all current aspirations.
- **Remaining Estimated Cost**: Accurate sum of unpurchased items (excluding purchased and archived items).
- **Missing Price Transparency**: Incomplete estimates are clearly flagged and never assumed to be Rp0 or free.
- **Recorded Savings**: Real-time aggregation of savings contributions across active plans.
- **Upcoming Target Timeline**: Horizon tracking for targets approaching their planned dates.

### 3. Life Goals & Quests
- **Experience & Milestone Quests**: Create aspirations with or without financial targets (e.g., *"Visit Mount Bromo"*, *"Become Internship-Ready"*).
- **Milestone Checklist**: Ordered milestones with automatic progress tracking (`completed / total * 100%`).
- **Wishlist Linkage**: Link related wishlist items to life quests without duplicating items.
- **Personal Reflections**: Record why an achieved goal mattered, what you learned, and whether it was worth the effort.

### 4. Savings Plans & Projections
- **Goal & Wish Savings Targets**: Associate savings plans with either a wishlist item or a life goal.
- **Monthly Contribution Pacing**: Calculates exact remaining amounts, percentage saved, and estimated months to target.
- **Contribution History**: Log individual contributions with dates and notes, with full ability to delete mistaken entries.

### 5. Vision Board
- **Visual Aspiration Grid**: Curate a dedicated vision board displaying featured dreams and goals.
- **Image Cards & Personal Reasons**: Highlights your intrinsic motivation and personal "why" behind each aspiration.

### 6. Achievement System & Idempotent XP
- **Milestone Badges**: 10 distinct achievements evaluated server-side based on actual database activity:
  - *First Step*: Create your first wishlist item (+50 XP)
  - *Planner*: Create your first life goal (+50 XP)
  - *First Purchase*: Complete your first purchase (+100 XP)
  - *Dream Achieved*: Complete your first life quest (+150 XP)
  - *Consistent Saver*: Contribute to savings on multiple distinct dates (+100 XP)
  - *Visionary*: Pin a dream to your vision board (+50 XP)
  - *Explorer*: Complete an experience-based life goal (+100 XP)
  - *Milestone Master*: Complete 5 milestones (+75 XP)
  - *Big Saver*: Record 5 or more savings contributions (+120 XP)
  - *Goal Crusher*: Complete 3 or more life goals (+200 XP)
- **Strict Anti-Pay-to-Win Rules**: XP is awarded exclusively for planning, consistency, and milestone completion — never merely for spending money.

### 7. Settings, Localization & Data Privacy
- **Multi-Currency Support**: Default Indonesian Rupiah (IDR), with support for USD, EUR, GBP, JPY, SGD, AUD, and CAD.
- **Theme Preferences**: Seamless light, dark, and system themes.
- **Data Export**: Full GDPR-compliant JSON data backup export of all your wishes, goals, milestones, savings entries, and achievements.
- **Account Deletion**: Complete multi-tenant cascade deletion with explicit keyword confirmation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **UI & Styling**: [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) v4, [Lucide React](https://lucide.dev/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Drizzle adapter and secure cookie sessions
- **Database & ORM**: [Neon PostgreSQL](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)
- **File Storage**: [UploadThing](https://uploadthing.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications & Effects**: [Sonner](https://sonner.emilkowal.ski/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🗄️ Database Schema & Data Isolation

All application tables enforce strict user-level multi-tenancy (`userId` foreign keys and indexed constraints):

1. `user`, `session`, `account`, `verification`: Better Auth identity and session management.
2. `user_preferences`: Display name, currency preference, and theme settings.
3. `categories`: User-scoped categories for organizing wishes and goals.
4. `wishlist_items`: Items with status (`idea`, `planned`, `saving`, `purchased`, `archived`), priority, estimates, and actual prices.
5. `goals`: Life goals with cover images, optional financial targets, and completion timestamps.
6. `goal_milestones`: Ordered actionable checkpoints for each goal.
7. `goal_wishlist_items`: Many-to-many junction connecting goals to wishlist items.
8. `savings_plans`: Savings targets associated with items or goals.
9. `savings_entries`: Individual financial contribution logs.
10. `user_achievements`: Idempotent record of earned badges and unlocked timestamps.
11. `goal_reflections`: Personal post-completion reflections and learnings.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20+ (tested on Node v24)
- **pnpm**: v9+ (or npm / yarn)
- **PostgreSQL**: Local PostgreSQL or cloud database (e.g., [Neon](https://neon.tech/))

### 2. Installation
Clone the repository and install dependencies:
```bash
pnpm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env.local
```

Fill in your configuration details in `.env.local`:
```env
# Database (Neon PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@ep-example.region.aws.neon.tech/neondb?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cloud Image Storage (UploadThing)
STORAGE_PROVIDER="uploadthing"
UPLOADTHING_TOKEN="your_uploadthing_token_here"
```

### 4. Database Migrations
Run the committed Drizzle database migration:
```bash
# Apply migrations to your PostgreSQL database
pnpm db:migrate
```

*(Optional) If you modify the schema in `src/lib/db/schema.ts`, generate new migrations:*
```bash
pnpm db:generate
```

### 5. Running the Application
Start the local development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Run the test suite:
```bash
pnpm test
```

Run TypeScript compilation check:
```bash
pnpm exec tsc --noEmit
```

Run ESLint verification:
```bash
pnpm lint
```

Verify production build:
```bash
pnpm build
```

---

## 🔒 Security & Data Privacy

- **Server-Side Authorization**: Every Server Action and Route Handler validates the authenticated session via `requireAuth()`. Query predicates enforce `eq(table.userId, session.user.id)`.
- **Protected File Uploads**: Image uploads are authenticated, restricted to image MIME types, and capped at 5MB.
- **Zero Injected Mock Data**: Financial figures, metrics, and progress percentages are dynamically computed from verified database records.
