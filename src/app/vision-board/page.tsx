import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getGoals } from "@/lib/actions/goals";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { VisionBoardView } from "@/components/vision-board/vision-board-view";

export const dynamic = "force-dynamic";

export default async function VisionBoardPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [wishes, goals, prefs, categories] = await Promise.all([
    getWishlistItems(),
    getGoals(),
    getUserPreferences(),
    getCategories(),
  ]);

  const boardWishes = wishes.filter((w) => w.onVisionBoard);
  const boardGoals = goals.filter((g) => g.onVisionBoard);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Vision Board"
      subtitle="A personal visual canvas representing your future aspirations"
    >
      <VisionBoardView
        boardWishes={boardWishes}
        boardGoals={boardGoals}
        allWishes={wishes}
        allGoals={goals}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
