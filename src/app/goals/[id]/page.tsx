import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getGoalById } from "@/lib/actions/goals";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getUserPreferences } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { GoalDetailView } from "@/components/goals/goal-detail-view";

interface GoalDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const [goal, wishes, prefs] = await Promise.all([
    getGoalById(id),
    getWishlistItems(),
    getUserPreferences(),
  ]);

  if (!goal) {
    redirect("/goals");
  }

  return (
    <AppShell
      user={session.user}
      currencySymbol={prefs.currency}
      title={goal.title}
      subtitle="Quest Milestones & Achievement Journey"
    >
      <GoalDetailView
        goal={goal}
        allWishlistItems={wishes}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
