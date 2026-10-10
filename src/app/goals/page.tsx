import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getGoals } from "@/lib/actions/goals";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { GoalsView } from "@/components/goals/goals-view";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [goals, categories, prefs] = await Promise.all([
    getGoals(),
    getCategories(),
    getUserPreferences(),
  ]);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Goals & Quests"
      subtitle="Group dreams into bigger life achievements, adventures, and milestones"
    >
      <GoalsView
        initialGoals={goals}
        categories={categories}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
