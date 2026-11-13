"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateUserPreferences,
  createCategory,
  deleteCategory,
  exportUserData,
  deleteUserAccount,
} from "@/lib/actions/user";
import { signOut } from "@/lib/auth/client";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/money";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import {
  Settings,
  User,
  FolderTree,
  Download,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import type { Category } from "@/types";

interface SettingsViewProps {
  initialPreferences: {
    currency: CurrencyCode;
    theme: "light" | "dark" | "system";
    displayName: string;
  };
  categories: Category[];
  userEmail: string;
}

export function SettingsView({
  initialPreferences,
  categories,
  userEmail,
}: SettingsViewProps) {
  const router = useRouter();
  const { theme: activeTheme, setTheme: setGlobalTheme } = useTheme();

  const [displayName, setDisplayName] = React.useState(
    initialPreferences.displayName || ""
  );
  const [currency, setCurrency] = React.useState<CurrencyCode>(
    initialPreferences.currency || "IDR"
  );
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    initialPreferences.theme || "system"
  );
  const [isSavingPrefs, setIsSavingPrefs] = React.useState(false);

  React.useEffect(() => {
    setTheme(activeTheme);
  }, [activeTheme]);

  // Categories
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [isCreatingCat, setIsCreatingCat] = React.useState(false);

  // Preferences save
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingPrefs(true);
      await updateUserPreferences({
        displayName,
        currency,
        theme,
      });

      setGlobalTheme(theme);

      toast.success("Preferences updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save preferences";
      toast.error(message);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreatingCat(true);
      await createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      toast.success("Category created");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create category";
      toast.error(message);
    } finally {
      setIsCreatingCat(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete category";
      toast.error(message);
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      toast.info("Generating data export...");
      const data = await exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daymark-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data export downloaded successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to export data";
      toast.error(message);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'To permanently delete your account and all records, type "DELETE" below:'
    );
    if (confirmation !== "DELETE") {
      toast.info("Account deletion cancelled");
      return;
    }

    try {
      await deleteUserAccount();
      await signOut();
      toast.success("Your account and all associated records have been deleted.");
      router.push("/auth/signin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete account";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
          <Settings className="h-6 w-6 stroke-[1.8]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Account & Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your profile, preferred currency, custom categories, and data backups.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] space-y-6 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Profile & Appearance</span>
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pref-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Display Name
              </Label>
              <Input
                id="pref-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pref-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Account Email
              </Label>
              <Input
                id="pref-email"
                value={userEmail}
                disabled
                className="h-10 rounded-xl bg-slate-50 dark:bg-white/[0.02] cursor-not-allowed text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pref-currency" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preferred Currency
              </Label>
              <select
                id="pref-currency"
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100 transition-colors"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} - {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pref-theme" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Interface Theme
              </Label>
              <select
                id="pref-theme"
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-100 transition-colors"
                value={theme}
                onChange={(e) => {
                  const next = e.target.value as "light" | "dark" | "system";
                  setTheme(next);
                  setGlobalTheme(next);
                }}
              >
                <option value="system">System Default</option>
                <option value="light">Light Mode (Porcelain)</option>
                <option value="dark">Dark Mode (Obsidian)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSavingPrefs} className="shadow-sm shadow-indigo-500/20">
              {isSavingPrefs ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>

      {/* Categories Management Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] space-y-6 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Custom Categories</span>
        </h3>

        {/* Add category form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
          <Input
            placeholder="New category name (e.g. Travel, Tech, Books)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="h-10 rounded-xl"
          />
          <Button
            type="submit"
            disabled={isCreatingCat || !newCategoryName.trim()}
            className="gap-1.5 shadow-sm shadow-indigo-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </form>

        {/* Categories list */}
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.04] text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>{c.name}</span>
                <button
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No custom categories yet. Categories help you organize wishes and goals.
          </p>
        )}
      </div>

      {/* Data Export & Danger Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Download className="h-5 w-5" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Export All Data
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Download a full JSON backup of all your wishlist items, goals, milestones, savings history, and reflections.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download JSON Backup</span>
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-xs dark:border-rose-500/20 dark:bg-rose-950/10 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="font-bold text-rose-950 dark:text-rose-200 text-sm">
              Danger Zone
            </h4>
          </div>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
            Permanently delete your account and all associated dreams, goals, and history. This cannot be undone.
          </p>
          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
