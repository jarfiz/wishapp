import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getSavingsPlans } from "@/lib/actions/savings";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getGoals } from "@/lib/actions/goals";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { SavingsView } from "@/components/savings/savings-view";

export const dynamic = "force-dynamic";

export default async function SavingsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [plans, wishes, goals, prefs, categories] = await Promise.all([
    getSavingsPlans(),
    getWishlistItems(),
    getGoals(),
    getUserPreferences(),
    getCategories(),
  ]);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Savings Plans"
      subtitle="Track intentional contributions, monthly pacing, and time to target"
    >
      <SavingsView
        initialPlans={plans}
        wishlistItems={wishes}
        goals={goals}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
