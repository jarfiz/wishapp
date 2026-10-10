import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getGoals } from "@/lib/actions/goals";
import { getSavingsPlans } from "@/lib/actions/savings";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { calculateWishlistSummary } from "@/lib/money";
import { AppShell } from "@/components/layout/app-shell";
import { OverviewView } from "@/components/dashboard/overview-view";
import type { WishlistItem } from "@/types";

function getUpcomingTargets(wishes: WishlistItem[]) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return wishes
    .filter(
      (w) =>
        w.status !== "purchased" &&
        w.status !== "archived" &&
        w.targetDate &&
        new Date(w.targetDate).getTime() >= cutoff
    )
    .sort(
      (a, b) =>
        new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime()
    )
    .slice(0, 4);
}

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [wishes, goals, savingsPlans, prefs, categories] = await Promise.all([
    getWishlistItems(),
    getGoals(),
    getSavingsPlans(),
    getUserPreferences(),
    getCategories(),
  ]);

  const financialSummary = calculateWishlistSummary(wishes);

  const totalSavingsRecorded = savingsPlans.reduce(
    (acc, p) => acc + (p.projection.totalSaved || 0),
    0
  );

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const featuredGoal = activeGoals[0] || null;
  const upcomingTargets = getUpcomingTargets(wishes);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Overview"
      subtitle="Track your wishlist value, progress, and upcoming targets"
    >
      <OverviewView
        userName={prefs.displayName || session.user.name}
        currency={prefs.currency}
        financialSummary={financialSummary}
        totalSavingsRecorded={totalSavingsRecorded}
        activeGoalsCount={activeGoals.length}
        completedGoalsCount={completedGoals.length}
        recentWishes={wishes}
        upcomingTargets={upcomingTargets}
        activeSavingsPlans={savingsPlans}
        featuredGoal={featuredGoal}
        categories={categories}
      />
    </AppShell>
  );
}
