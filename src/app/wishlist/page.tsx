import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [items, categories, prefs] = await Promise.all([
    getWishlistItems(),
    getCategories(),
    getUserPreferences(),
  ]);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="My Wishlist"
      subtitle="Collect, organize, and prioritize the things you desire"
    >
      <WishlistView
        initialItems={items}
        categories={categories}
        currency={prefs.currency}
      />
    </AppShell>
  );
}
