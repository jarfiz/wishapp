import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getUserPreferences, getCategories } from "@/lib/actions/user";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsView } from "@/components/settings/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [prefs, categories] = await Promise.all([
    getUserPreferences(),
    getCategories(),
  ]);

  return (
    <AppShell
      user={session.user}
      categories={categories}
      currencySymbol={prefs.currency}
      title="Settings"
      subtitle="Customize your profile, preferences, and data options"
    >
      <SettingsView
        initialPreferences={prefs}
        categories={categories}
        userEmail={session.user.email}
      />
    </AppShell>
  );
}
