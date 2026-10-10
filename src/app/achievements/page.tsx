import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { userAchievements } from "@/lib/db/schema";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getGoals } from "@/lib/actions/goals";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { AchievementsView } from "@/components/achievements/achievements-view";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  const [unlocked, wishes, goals, prefs, categories] = await Promise.all([
    db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt)),
    getWishlistItems({ status: "purchased" }),
    getGoals(),
    getUserPreferences(),
    getCategories(),
  ]);

  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Achievements & Milestones"
      subtitle="Celebrate unlocked badges, purchases, and conquered goals"
    >
      <AchievementsView
        unlockedAchievements={unlocked}
        completedWishes={wishes}
        completedGoals={completedGoals}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
