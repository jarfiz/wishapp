## 1. ROLE AND MISSION

Act as a senior full-stack software engineer, product designer, UI/UX designer, database architect, and QA engineer.

Your task is to design, implement, test, and document a complete, production-minded full-stack web application called **Daymark** (working title; keep the branding easy to change).

Daymark is a personal wishlist, life-goal planner, and achievement tracking application. It helps users collect the things they want, estimate their costs, set target dates, organize their dreams into goals, track their financial progress, and celebrate accomplishments.

This must be a genuinely functional application, not a static prototype, a Figma recreation, or a frontend that relies on mock data.

**Work directly in the project repository. Inspect the existing codebase first, then implement the application end-to-end. Do not stop after creating a plan, scaffolding the project, or producing a list of recommendations.**

When requirements are ambiguous, choose the most sensible implementation consistent with the product vision. Do not interrupt the implementation process with avoidable questions. If credentials for an external service are unavailable, build the integration, document the required environment variables, and continue implementing everything else.

## 2. PRODUCT VISION

The fundamental concept is:

"Dream about it. Plan for it. Work toward it. Achieve it."

Daymark should feel like a personal space for the life someone wants to build.

A user should be able to:

1. Quickly write down something they want.
2. Add a photo whenever they are ready.
3. Record an estimated price without having to know it immediately.
4. Set an optional target date.
5. Organize their wishes into categories and larger life goals.
6. See the estimated total cost of their wishlist.
7. Create optional savings plans for selected goals or purchases.
8. Mark items as purchased and preserve their achievement history.
9. Earn achievements for progress, persistence, and meaningful milestones.
10. Build a visual board representing their future aspirations.

The emotional aspect should be motivational and optimistic, inspired by vision boards and game-like achievement systems. The practical side must remain grounded in real actions, useful financial calculations, and realistic planning.

Do not turn this into an accounting application, an e-commerce store, or an overly complicated RPG.

The default experience should be immediately useful, even to a user who has never configured a budget or entered a savings amount.

## 3. TECH STACK

Use the following stack unless the existing repository has a strong technical reason to require an adjustment.

### Core

- Next.js using the App Router and the latest compatible stable release.
- React.
- TypeScript with strict mode enabled.
- Node.js runtime for database-dependent server operations.
- pnpm for package management.
- Tailwind CSS.
- shadcn/ui for accessible, reusable UI components.
- Lucide React for icons.

### Backend and data

- Better Auth for authentication and sessions.
- Drizzle ORM for database access and schema management.
- Neon PostgreSQL as the persistent relational database.
- Zod for input validation.
- React Hook Form with Zod integration for complex forms.

### Supporting libraries

Choose compatible stable libraries when useful:

- date-fns for date handling.
- A lightweight charting library for genuinely useful dashboard visualizations.
- Motion or the current supported Motion for React package for restrained animations.
- Sonner for toast notifications.
- A robust table or data-grid solution only if genuinely necessary.

### File storage

Use a persistent cloud object-storage service for uploaded images, preferably an option that fits naturally into the deployment environment.

Keep storage operations behind a small abstraction so that the provider can be replaced later.

Never persist image data as Base64 strings inside PostgreSQL. Store stable storage keys or URLs in the database, support image replacement and removal, and enforce authentication and ownership during uploads and deletions.

Document the required storage configuration.

### Development quality

- ESLint.
- Prettier if appropriate for the project.
- A testing framework such as Vitest.
- Playwright for critical end-to-end flows where practical.

Use current official documentation for Next.js, Better Auth, Drizzle ORM, Neon, Tailwind CSS, and shadcn/ui before implementing integrations. Do not rely on obsolete APIs or invented configuration options.

Do not introduce additional frameworks or dependencies without a clear reason.

## 4. FIRST: INSPECT THE REPOSITORY

Before modifying anything:

1. Inspect the repository structure, package.json, existing routes, installed packages, configuration, and available environment-variable templates.
2. Identify whether the project is new or contains existing functionality worth preserving.
3. Inspect existing components and coding conventions.
4. Identify missing environment variables without printing, exposing, or committing secret values.
5. Determine the appropriate implementation plan and then execute it.

If the repository is empty, scaffold a proper Next.js App Router application.

If an application already exists, work with its structure where sensible instead of blindly overwriting it.

Do not delete existing user data, existing migrations, or valuable code without a compelling reason.

Do not commit .env files, database credentials, authentication secrets, storage tokens, or any other sensitive information.

## 5. PRODUCT ARCHITECTURE AND NAVIGATION

Create an authenticated application with the following primary sections.

### A. Overview

The user's personal dashboard.

Include:

- A welcoming heading and short motivational message.
- Total estimated wishlist value.
- Remaining estimated cost of items not yet purchased.
- Recorded savings across active plans.
- Number of active goals.
- Number of completed goals and purchases.
- Upcoming target dates.
- Recently added wishes.
- Current or featured goal.
- Progress toward selected savings targets.
- A quick-add action.
- A useful empty state for new users.

Do not overwhelm users with charts. Prioritize clear numbers, actionable information, and attractive visual organization.

Every metric must be calculated from the database and use clearly defined rules. Never use hardcoded statistics or fake activity data.

### B. My Wishlist

The primary workspace for creating and managing wishes.

Provide:

- An attractive image-card grid.
- A compact list view.
- Search.
- Filtering by category, status, priority, and target date.
- Sorting by recently added, target date, price, priority, and name.
- A quick-add button.
- An add/edit dialog or sheet.
- Item detail access.
- An obvious completion checkbox.
- An archive action.
- An optional image-upload interface.
- Useful loading, empty, error, and success states.

The interface must remain useful when the user has dozens or hundreds of items.

### C. Goals & Quests

A place to group related wishes and track larger aspirations.

Examples:

- Build My Dream Setup.
- Visit Germany.
- Become Internship-Ready.
- Launch My First Product.
- Build an Emergency Fund.
- Create My Ideal Workspace.

Goals may contain linked wishlist items and independently defined milestones.

A goal must also be able to exist without any purchased product. It may represent a learning objective, an experience, a personal milestone, or another aspiration.

### D. Vision Board

A visual collection of future aspirations.

Provide a dedicated page that displays selected goals and wishlist items in an attractive, image-oriented layout.

Support:

- Selecting and deselecting items for the board.
- Optional custom board title and description.
- Arranging the board into a simple responsive grid.
- Opening a card to view and edit the original record.
- Featured dreams.
- Attractive image placeholders for items without photos.

Do not build a complicated freeform canvas in the initial version. A polished, flexible visual grid is sufficient.

### E. Achievements

Show completed purchases, completed goals, and earned achievement badges.

Include:

- Completed item history.
- Completed goal history.
- Earned and locked achievements.
- Completion dates.
- Optional reflections.
- Optional photos of the achieved result.
- A simple personal progress summary.

The page should feel like a record of the user's journey, rather than a competitive leaderboard.

### F. Settings

Include:

- User profile.
- Preferred display name.
- Preferred currency, defaulting to IDR (Indonesian rupiah).
- Light, dark, and system theme preferences.
- Account and session management.
- Category management.
- Data export.
- Account deletion with appropriate confirmation.

Keep navigation, layouts, and branding consistent across all pages.

## 6. WISHLIST ITEM FUNCTIONALITY

This is the application's most important feature.

Users must be able to create, read, update, archive, delete, search, filter, sort, and complete wishlist items.

### Item fields

Each item should support the following fields:

- Unique ID.
- Owner user ID.
- Name — required.
- Description — optional.
- Image — optional and uploadable later.
- Estimated price — optional.
- Actual purchase price — optional.
- Category — optional.
- Priority — low, medium, or high.
- Status — idea, planned, saving, purchased, or archived.
- Target date — optional.
- Purchase date — optional.
- Product URL — optional.
- Personal reason or notes — optional.
- Whether the item appears on the vision board.
- Created timestamp.
- Updated timestamp.
- Purchased timestamp where appropriate.

Use an appropriate relational representation and database constraints.

### Quick-add behavior

Creating an item must be extremely fast.

The user should only need to enter a name to create a valid item.

All other fields are optional.

After creation, the item should immediately appear in the correct view, and relevant summary totals should update.

Do not block saving because:

- The user does not know the price.
- The user has not found an image.
- The user has not decided on a target date.
- The user has not chosen a category.

### Optional image behavior

When an item has no image, render a deliberate, attractive placeholder with a suitable icon.

Do not render broken images or empty image containers.

Allow images to be added after creation, replaced, or removed.

Use proper upload progress and error feedback where appropriate.

Validate file type and size. Enforce ownership checks on server-side upload and deletion operations.

### Purchase checklist

A clear checkbox or completion control must be available directly on wishlist cards and in list view.

When the user marks an item as purchased:

- Update the database status.
- Record the purchase date.
- Allow the actual purchase price to be entered.
- Preserve the original estimate.
- Display a clear success state.
- Update the relevant dashboard metrics.
- Preserve the item in the purchase history.
- Evaluate relevant achievement rules.

If the user marks an item as purchased without entering the actual price, allow the action and retain a missing-actual-price state.

Allow undoing the purchase action with a sensible confirmation and consistent data updates.

Distinguish purchased items from archived items. Archiving should not falsely award a purchase achievement.

### Deletion and editing

Provide accessible confirmation for destructive actions.

Edits must persist in the database.

Deleting an item must also handle related associations safely. When deletion could remove useful financial or achievement history, prefer archiving instead of silently destroying that history.

## 7. PRICE CALCULATIONS AND FINANCIAL DASHBOARD

All money calculations must use database-backed information.

Keep all monetary values in the user's configured currency for the initial implementation. Do not add automatic foreign-exchange conversion unless explicitly implemented with reliable exchange-rate data.

Use precise monetary storage and calculation practices. Do not rely on uncontrolled floating-point arithmetic for financial totals.

### Define the metrics clearly

1. **Active wishlist estimate:** Sum of known estimated prices for non-archived wishlist items, including purchased items where appropriate.
2. **Remaining estimated cost:** Sum of known estimated prices for non-archived items not yet purchased.
3. **Recorded purchase spending:** Sum of known actual purchase prices for purchased items.
4. **Purchased items without actual price:** A separate count.
5. **Unknown estimates:** Count of active, unpurchased items without an estimated price.
6. **Savings progress:** Recorded contributions toward active savings plans.
7. **Goal completion:** Based on completed milestones, not on spending money.

Avoid mixing these quantities into a single ambiguous number.

Items with missing prices must not be treated as free. Clearly communicate when totals are incomplete.

When an item is purchased, do not remove it from the user's achievement history. Purchased records must not continue contributing to the remaining-cost total.

Do not count a purchased item's actual price as a remaining financial obligation.

All totals must remain consistent when records are created, updated, purchased, unpurchased, archived, restored, or deleted.

### Dashboard behavior

Use a clean card layout for financial summaries.

Where useful, add:

- Estimated remaining cost by category.
- Highest-priority upcoming purchases.
- Targets approaching their due dates.
- Progress toward selected savings targets.
- A breakdown of items with unknown prices.

Every visualization must have a useful purpose, responsive layout, and accessible labels. Avoid decorative charts that add little information.

## 8. SAVINGS PLANS

Implement a simple, optional savings-planning system.

A user should be able to create a savings plan associated with a wishlist item or a larger goal.

Each plan should include:

- Associated item or goal.
- Target amount.
- Optional planned monthly contribution.
- Recorded savings entries.
- Creation timestamp.
- Updated timestamp.

Enforce the appropriate relationship constraints so a single plan cannot accidentally refer to unrelated items and goals simultaneously.

Allow users to record a contribution, edit or remove an incorrect entry, and view contribution history.

Calculate:

- Target amount.
- Total recorded savings.
- Remaining amount.
- Percentage saved.
- Estimated time to target when a valid monthly contribution exists.

For example, if an item costs Rp3,000,000, the user has recorded Rp500,000 in contributions, and they plan to contribute Rp500,000 per month, the remaining amount is Rp2,500,000 and the estimate is five monthly contributions.

The calculation is a projection, not a guaranteed purchase date. It must not assume income, interest, or investment returns.

If the target or monthly contribution is missing, display an appropriate incomplete state instead of dividing by zero or presenting misleading projections.

Savings contributions must not automatically mark an item as purchased.

Purchasing an item must not fabricate savings entries. Keep saving money and buying something as distinct events.

## 9. GOALS, QUESTS, AND MILESTONES

Create a flexible goal system.

### Goal fields

- ID and owner user ID.
- Title.
- Description.
- Optional cover image.
- Optional target date.
- Optional target amount.
- Optional monthly contribution.
- Status: active, paused, completed, or archived.
- Optional category.
- Created and updated timestamps.
- Completion timestamp where applicable.

Goals must support experiences and personal milestones even when they have no financial target.

### Goal milestones

Each goal can include an ordered set of milestones.

Examples for "Become Internship-Ready":

- Finish a portfolio project.
- Write a professional CV.
- Publish the portfolio.
- Apply to five internships.

Each milestone should have:

- Title.
- Optional description.
- Completion state.
- Position or sort order.
- Completion timestamp where applicable.

Calculate goal progress from completed milestones divided by total milestones.

When a goal has no milestones, display a sensible empty state and suggest adding the first milestone. Do not divide by zero or automatically claim the goal is complete.

Provide the ability to:

- Create goals.
- Edit goals.
- Add and edit milestones.
- Reorder milestones.
- Mark milestones complete or incomplete.
- Link wishlist items.
- Pause and resume goals.
- Complete a goal.
- Reopen an accidentally completed goal.
- Archive or delete a goal.
- Review achieved goals.

A goal should not be completed simply because a linked product was purchased if other milestones remain incomplete.

Allow a user to explicitly mark a goal as completed, with sensible feedback and an opportunity to preserve a reflection.

## 10. GAMIFICATION AND ACHIEVEMENTS

Build a small but meaningful achievement system.

Suggested achievements:

- **First Step:** Create the first wishlist item.
- **Planner:** Create the first goal.
- **First Purchase:** Complete the first purchase.
- **Dream Achieved:** Complete the first goal.
- **Consistent Saver:** Make contributions on multiple distinct dates.
- **Visionary:** Add a goal or wishlist item to the vision board.
- **Explorer:** Complete an experience-based goal.

Use actual server-side data to determine whether an achievement has been earned.

Achievements must be unique per user and must not be awarded repeatedly for the same event.

Where possible, make achievement checks idempotent and safe to execute after retries.

If an action is undone, do not silently erase the historical fact that the achievement was earned unless that is an explicitly designed rule.

A user may receive a small XP reward when an achievement is first unlocked. XP must not be awarded merely for spending money.

Keep the system simple. There is no need for multiplayer, public leaderboards, competitive ranking, loot boxes, or an elaborate game economy.

Use restrained visual celebration and a brief animation when an achievement is first unlocked.

Respect reduced-motion accessibility preferences.

## 11. VISION BOARD AND PERSONAL REFLECTION

Give users an optional emotional connection to the product.

A vision board should be visually attractive without becoming difficult to manage.

Allow users to feature selected items and goals.

Each wishlist item or goal may have a short personal reason, such as:

"I want this camera because I want to make better travel videos."

After completing a major goal, allow the user to add an optional reflection:

- What did I achieve?
- Why was it important?
- What did I learn?
- Was it worth the effort?

The reflection should be editable and private to the owning user.

A future version may provide monthly reflections or year-end recaps. For the initial implementation, focus on the underlying records and a clean achievement detail page.

Do not make unsupported claims about manifestation. Present visualization as a motivational tool that works alongside planning and action.

## 12. DATABASE DESIGN

Create a normalized PostgreSQL data model using Drizzle ORM.

The final schema should cover the following logical entities, adjusting the exact structure to fit the selected implementation.

### Authentication tables

Use Better Auth's supported database schema and adapter. Include the required user, session, account, and verification tables for the chosen authentication methods.

Do not invent Better Auth table definitions or incompatible adapters.

### Application tables

**WishlistItem**

Stores the owner's wishlist item, optional prices, status, category, image reference, target date, notes, purchase information, product URL, vision-board selection, and timestamps.

**Category**

Stores the user-defined categories, including name and optional icon. Enforce suitable uniqueness rules within each user account.

**Goal**

Stores life goals, descriptions, status, optional target dates, optional financial targets, and related metadata.

**GoalMilestone**

Stores each goal's ordered milestones and completion state.

**GoalWishlistItem**

Links goals to wishlist items while preventing duplicate associations.

**SavingsPlan**

Stores a savings target associated with an item or goal, with appropriate foreign keys and constraints.

**SavingsEntry**

Records individual contributions with amount, date, and optional note.

**AchievementDefinition**

Stores the supported achievement types and their display metadata, or use a well-defined server-controlled registry if a database table is unnecessary.

**UserAchievement**

Records the achievements earned by each user and the date they were earned. Prevent duplicate awards for the same achievement.

**GoalReflection**

Stores optional personal reflections associated with completed goals.

**UserPreference**

Stores currency, theme, and other user-configurable preferences, unless these are appropriately included in the user profile or another existing schema.

Use UUIDs or another consistent non-guessable identifier strategy.

Include appropriate foreign keys, indexes, unique constraints, and cascade behavior.

Add created and updated timestamps where appropriate.

Use database migrations committed to the repository. Never rely on pushing a schema directly to production as an undocumented manual step.

Keep schema definitions, migrations, and the actual database behavior synchronized.

## 13. AUTHENTICATION AND AUTHORIZATION

Implement genuine authentication with Better Auth.

Required flows:

- Registration.
- Sign in.
- Sign out.
- Session persistence.
- Protected application routes.
- Appropriate public and authenticated layouts.
- Authenticated account access.

Use a sensible initial email-and-password authentication flow.

If email verification or password reset requires an email provider, implement it using a supported provider when credentials are available. Otherwise, document the missing configuration and provide clear setup instructions.

Do not fake authentication with hardcoded users.

Do not treat a user ID supplied by the client as proof of ownership.

### Critical ownership rules

Every application query and mutation must be scoped to the authenticated user.

A user must not be able to access, update, delete, or associate another user's:

- Wishlist items.
- Images.
- Categories.
- Goals.
- Milestones.
- Savings plans.
- Savings entries.
- Achievements.
- Reflections.

Implement authorization checks on the server, not just in the interface.

Validate route parameters and record ownership before returning or mutating data.

Never expose session secrets or database credentials to browser code.

Use the current documented patterns for Better Auth with Next.js and Drizzle.

## 14. APPLICATION ARCHITECTURE

Use an architecture that takes advantage of Next.js without making the application unnecessarily complicated.

Prefer Server Components for pages and data-oriented UI by default.

Use Client Components for interactive forms, dialogs, checkboxes, visual controls, and other components that genuinely need browser-side interactivity.

Use Server Actions or Route Handlers according to the current Next.js conventions and the needs of the operation.

Keep database access server-side.

Suggested organization:

- `src/app/` — routes, layouts, loading states, error boundaries, and route handlers.
- `src/components/ui/` — shadcn/ui components.
- `src/components/layout/` — sidebar, header, navigation, and responsive shell.
- `src/components/dashboard/` — overview cards and dashboard sections.
- `src/components/wishlist/` — item cards, forms, filters, views, and dialogs.
- `src/components/goals/` — goal cards, goal forms, and milestones.
- `src/components/vision-board/` — vision-board interface.
- `src/components/achievements/` — achievement cards and history.
- `src/lib/auth/` — Better Auth setup and helpers.
- `src/lib/db/` — database connection, schema, and shared queries.
- `src/lib/validations/` — Zod input schemas.
- `src/lib/storage/` — file-storage provider abstraction.
- `src/lib/money/` — currency formatting and financial calculations.
- `src/lib/actions/` — domain mutations and application operations, where appropriate.
- `src/types/` — shared types when they add value.
- `drizzle/` — generated SQL migrations.
- `tests/` — unit and integration tests.

This structure is a guideline, not a reason to create unnecessary wrappers or abstraction layers.

Avoid giant page components containing every feature. Break the application into logical components and modules.

Avoid overusing global state, Context, custom hooks, or client-side fetching when server rendering and targeted mutations are simpler.

Do not duplicate the same business rules between multiple pages.

## 15. USER INTERFACE AND DESIGN SYSTEM

The interface is a major part of the product. It should feel like a thoughtfully designed premium personal productivity application.

### Visual direction

- Minimal.
- Modern.
- Calm.
- Aspirational.
- Elegant.
- Highly readable.
- Image-oriented without being cluttered.
- Subtle game-inspired details rather than an obvious gaming interface.

Avoid the appearance of a generic admin dashboard, an online store, or a financial institution portal.

Use the design quality of modern personal productivity products as inspiration, but do not copy another product's exact design.

### Color system

Start with light mode:

- Soft neutral backgrounds.
- White or slightly warm surfaces.
- Dark readable typography.
- Subtle dividers and borders.
- Restrained muted green, blue, or violet as an accent.
- Consistent semantic colors for success, warning, and destructive actions.

Add a polished dark mode.

Use design tokens and semantic colors rather than hardcoding colors throughout the component tree.

Do not fill the interface with gradients, excessive glow, heavy shadows, colorful cards, or gratuitous glassmorphism.

### Typography and spacing

Establish a consistent type scale and spacing system.

Use a modern readable sans-serif font. Favor clear information hierarchy and generous whitespace.

Keep card titles, currency figures, dates, badges, and action buttons visually consistent.

Use tabular number styling for financial metrics where appropriate.

### Layout

Desktop:

- A collapsible or compact left sidebar.
- Application branding at the top.
- Main navigation.
- User profile and settings near the bottom.
- A main content area with consistent maximum width and spacing.
- A top header with page title, context, and primary action.

Mobile:

- A responsive navigation drawer or bottom navigation.
- Full-width layouts and accessible touch targets.
- Dialogs that become appropriate mobile sheets when necessary.
- No accidental horizontal scrolling.
- Comfortable forms and readable financial summaries.

### Wishlist cards

Each item card should clearly show:

- Image or placeholder.
- Item title.
- Estimated price or "Price not set".
- Category where available.
- Target date where available.
- Priority where useful.
- Current status.
- An obvious purchase checkbox.
- A secondary menu for editing, archiving, or deleting.

Do not display every database field on the card.

### Interaction quality

Implement:

- Thoughtful hover and focus states.
- Skeleton loading where it improves perceived performance.
- Toast feedback for mutations.
- Inline validation errors.
- Clear confirmation for destructive actions.
- Meaningful empty states with relevant calls to action.
- Error boundaries and retry behavior where appropriate.
- Keyboard navigation.
- Accessible dialogs.
- Proper labels and accessible names.
- `prefers-reduced-motion` support.

Use animation sparingly. A small transition can make an interface feel polished; a large animation on every interaction will make it feel slow.

### Responsive verification

Verify the application at approximately:

- 375px mobile width.
- 768px tablet width.
- 1024px laptop width.
- 1440px desktop width.

Resolve overflow, clipped dialogs, unreadable cards, and awkward sidebar behavior.

## 16. REQUIRED USER FLOWS

Implement and test the following end-to-end scenarios.

### Flow A: A new user starts

1. Register a new account.
2. Sign in.
3. Arrive at an empty dashboard.
4. See a helpful explanation of the application.
5. Create the first wishlist item without an image or price.
6. See the item appear immediately.
7. Reload the page and confirm the item still exists.

### Flow B: Complete a wishlist item

1. Open the wishlist.
2. Add a new item with a name and estimated price.
3. Optionally upload a photo.
4. Edit the item.
5. Set a target date and priority.
6. Mark it as purchased.
7. Optionally enter the actual purchase price.
8. Confirm that the dashboard and purchase history update correctly.

### Flow C: Create a larger goal

1. Create a goal called "Build My Dream Setup".
2. Add several milestones.
3. Link existing wishlist items.
4. Mark a milestone complete.
5. Confirm progress updates.
6. Complete the goal when appropriate.
7. Confirm its achievement appears in the achievement history.

### Flow D: Track savings

1. Create a savings plan for a wishlist item or goal.
2. Enter a target amount and planned monthly contribution.
3. Record contributions over time.
4. Confirm the remaining amount and projection update.
5. Edit or remove an incorrect contribution.
6. Confirm all calculations remain accurate.

### Flow E: Vision board

1. Add a photo to a wishlist item.
2. Select the item for the vision board.
3. Create and feature a goal.
4. Open the vision board.
5. Confirm the selected records appear.
6. Remove an item from the board and confirm the underlying wishlist record remains intact.

### Flow F: Authentication and security

1. Create two different accounts.
2. Populate each account with separate private records.
3. Confirm users can access only their own records.
4. Attempt direct access to a record belonging to the other account.
5. Confirm unauthorized reads and mutations fail safely.

### Flow G: Empty and incomplete data

1. Create an item without a price, image, category, or target date.
2. Confirm that it saves successfully.
3. Confirm unknown prices do not count as zero-cost purchases.
4. Confirm that totals visibly indicate incomplete estimates.
5. Confirm that no missing data creates invalid dates, broken images, or calculation errors.

## 17. PERFORMANCE, ACCESSIBILITY, AND RELIABILITY

Follow practical performance and security standards.

- Avoid fetching the same data repeatedly in the same request.
- Add database indexes for common filters and ownership queries.
- Paginate or progressively load large lists when appropriate.
- Use image sizing and optimization sensibly.
- Avoid unnecessary client-side JavaScript.
- Prevent duplicate submissions.
- Use stable IDs for rendered database records.
- Handle loading, empty, error, and success states explicitly.
- Avoid exposing internal database errors to users.
- Log useful server-side errors without logging secrets.
- Validate all untrusted input on the server.
- Use appropriate database transactions for related multi-step mutations.
- Prevent unauthorized access through direct API or action calls.
- Apply rate limits to sensitive or abuse-prone endpoints where appropriate.
- Use safe rendering and avoid SQL injection.
- Maintain semantic HTML and accessible forms.
- Avoid relying on color alone to convey status.

Do not cache private user data in a way that could expose one user's information to another user. Use appropriate Next.js cache and revalidation strategies for authenticated pages and mutations.

## 18. ENVIRONMENT VARIABLES AND SETUP

Create an `.env.example` containing all required variable names with placeholder values, never live secrets.

Include variables appropriate to the final implementation, such as:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- The chosen image-storage provider's required token or credentials.
- Email-provider configuration if email features are implemented.
- Any other genuinely necessary public or server-side configuration.

Use the exact variable names expected by the chosen libraries.

Never expose secret variables through a `NEXT_PUBLIC_` prefix.

Ensure the application has a clear and actionable setup process:

1. Install dependencies.
2. Configure environment variables.
3. Create or connect a Neon PostgreSQL database.
4. Run database migrations.
5. Configure Better Auth.
6. Configure image storage.
7. Start the development server.
8. Run tests and production build.

Do not claim a feature is fully operational when its required credentials have not been configured.

Where external credentials are unavailable, provide a useful setup guide and verify the remaining code as far as possible.

## 19. MIGRATIONS, SEEDING, AND DATA INTEGRITY

Implement database schema changes with Drizzle migrations.

Requirements:

- Commit generated migration files.
- Provide documented migration commands.
- Make the initial setup reproducible.
- Never require users to manually create production tables in a database console.
- Include development-only demo data or a seed script if useful.
- Ensure seeded data is clearly separate from production user data.
- Do not populate new user accounts with fake purchases or fabricated achievements.
- Ensure data relationships remain valid when records are edited or deleted.
- Prevent duplicate categories, associations, savings plans, and achievement awards where appropriate.

Create a safe deletion strategy for each relational entity.

Use database transactions for logically related operations, such as changing purchase status and recording the relevant completion timestamp.

## 20. TESTING AND QUALITY CONTROL

Do not finish when the interface merely looks correct.

Test the real behavior.

At minimum, add tests for:

- Price totals and remaining-cost calculations.
- Unknown prices.
- Purchased versus unpurchased items.
- Savings calculations and contribution edits.
- Progress calculations with and without milestones.
- Achievement eligibility and duplicate prevention.
- Data ownership and authorization.
- Input validation.
- Core CRUD behavior.

Use integration or end-to-end tests where appropriate.

After implementation:

1. Run the formatter if configured.
2. Run lint.
3. Run TypeScript type checking.
4. Run unit tests.
5. Run database migration validation where possible.
6. Run the production build.
7. Fix the failures that can be reproduced and resolved.
8. Inspect the key screens at mobile and desktop sizes.
9. Verify that persistent records survive a full page reload.
10. Verify that protected pages require authentication.

Do not suppress type errors, disable lint rules globally, or weaken validation just to make the build pass.

If a check cannot run because the environment lacks a necessary service or credential, explain exactly what is blocked.

## 21. DOCUMENTATION

Create a high-quality README containing:

- Product overview.
- Main features.
- Tech stack.
- Architecture overview.
- Repository structure.
- Prerequisites.
- Environment-variable reference.
- Neon setup.
- Better Auth setup.
- Image-storage configuration.
- Database migration commands.
- Development commands.
- Testing instructions.
- Production build and deployment instructions.
- Known limitations and future improvements.

Document any architectural decisions that are important for future development.

Keep the instructions specific to the implementation actually created.

## 22. IMPLEMENTATION ORDER

Use the following order to keep the project coherent.

### Phase 1 — Foundation

- Inspect the repository.
- Establish the project structure.
- Configure the design system.
- Set up the database connection.
- Implement the schema and migrations.
- Configure Better Auth.
- Create authenticated and public layouts.

### Phase 2 — Wishlist core

- Implement CRUD operations.
- Build add/edit forms.
- Add optional image uploads.
- Build the card grid and list view.
- Add search, filtering, and sorting.
- Implement the purchase checklist.
- Validate persistent storage and ownership security.

### Phase 3 — Financial overview

- Implement monetary calculations.
- Create dashboard summary cards.
- Handle unknown prices accurately.
- Show remaining estimated costs.
- Implement purchase history and actual-price tracking.

### Phase 4 — Goals and savings

- Build goals and milestones.
- Link items to goals.
- Implement savings plans and contribution history.
- Add projections and progress indicators.
- Validate financial and progress calculations.

### Phase 5 — Motivation and reflection

- Build the vision board.
- Implement achievements.
- Add completion celebrations.
- Build reflections and achievement history.

### Phase 6 — Polish and verification

- Improve responsive behavior.
- Finish loading and empty states.
- Improve accessibility.
- Run and repair tests.
- Validate database migrations and production build.
- Complete the README and environment template.

This order is a guide, not permission to stop after one phase. Continue through the entire application unless a real external blocker prevents further progress.

## 23. RULES FOR THE CODING AGENT

Follow these requirements throughout the implementation.

1. Build a complete working application, not merely a plan or a UI mockup.
2. Use real server-side operations and database persistence for domain data.
3. Do not use localStorage as the primary database for wishlist items, goals, savings, or achievements.
4. Do not use hardcoded arrays as substitutes for application data.
5. Do not use fake authentication or simulated database requests.
6. Do not generate dead buttons, empty menu actions, fake charts, or nonfunctional forms.
7. Do not leave essential features as TODO comments or placeholder pages.
8. Do not invent successful external-service responses.
9. Do not skip authorization checks because a page is already protected.
10. Do not expose secret credentials.
11. Reuse components when doing so creates genuine consistency.
12. Prefer straightforward, maintainable solutions over elaborate abstractions.
13. Avoid adding features outside the stated scope unless they solve a real implementation problem.
14. Use official documentation for changing library APIs.
15. Keep user-facing copy polished, helpful, and consistent.
16. Ensure all major actions provide immediate, understandable feedback.
17. Preserve the original estimate when recording an actual purchase price.
18. Keep financial contributions separate from purchases.
19. Do not treat missing prices, images, or target dates as errors.
20. Complete the implementation, run available checks, and report the actual results honestly.

## 24. DEFINITION OF DONE

The project is complete when:

- The application runs locally using documented commands.
- A user can register, sign in, and sign out.
- Private application routes are protected.
- Wishlist items persist in PostgreSQL.
- Items can be created without optional fields.
- Images can be uploaded and managed through persistent storage.
- Users can edit, archive, purchase, and manage wishlist items.
- Price totals update correctly.
- Unknown prices are handled transparently.
- Actual purchase prices and purchase history are preserved.
- Goals and milestones work.
- Savings plans and contributions work.
- The vision board shows persisted selections.
- Achievements are earned from real application events.
- Users cannot access one another's private records.
- Desktop and mobile layouts are usable.
- Error, loading, empty, and success states are implemented.
- Migrations and setup instructions are included.
- Tests cover the important business rules.
- Lint, type checking, and production build have been run, with results documented.

## 25. FINAL RESPONSE AFTER IMPLEMENTATION

When the implementation is complete, provide a concise engineering summary containing:

1. What was implemented.
2. The main architectural and data-model decisions.
3. The commands needed to run the project locally.
4. The environment variables and external services the user must configure.
5. Database migration instructions.
6. Test, lint, type-check, and production-build results.
7. Any genuinely unfinished features or external blockers.

Clearly distinguish features that were implemented and verified from features that still require credentials or further work.

Now inspect the repository and begin implementation. Make sound engineering decisions, prioritize correctness and usability, and continue until the definition of done has been addressed.