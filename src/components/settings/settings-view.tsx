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

      // Apply theme to document if changed
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

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
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Account & Settings
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Manage your profile, preferred currency, categories, and data.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-6">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-600" />
          <span>Profile & Appearance</span>
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pref-name">Display Name</Label>
              <Input
                id="pref-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pref-email">Account Email</Label>
              <Input
                id="pref-email"
                value={userEmail}
                disabled
                className="bg-zinc-50 dark:bg-zinc-800/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pref-currency">Preferred Currency</Label>
              <select
                id="pref-currency"
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
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
              <Label htmlFor="pref-theme">Interface Theme</Label>
              <select
                id="pref-theme"
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
              >
                <option value="system">System Default</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSavingPrefs}>
              {isSavingPrefs ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>

      {/* Categories Management Section */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-6">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-indigo-600" />
          <span>Custom Categories</span>
        </h3>

        {/* Add category form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
          <Input
            placeholder="New category name (e.g. Travel, Tech, Books)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isCreatingCat || !newCategoryName.trim()}
            className="gap-1.5"
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
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-800/60 text-xs font-medium"
              >
                <span>{c.name}</span>
                <button
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="text-zinc-400 hover:text-red-500 cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400">
            No custom categories yet. Categories help you organize wishes and goals.
          </p>
        )}
      </div>

      {/* Data Export & Danger Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Download className="h-5 w-5" />
            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
              Export All Data
            </h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
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
        <div className="rounded-2xl border border-red-200/60 bg-red-50/20 p-6 shadow-xs dark:border-red-950/40 dark:bg-red-950/10 space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="font-bold text-red-900 dark:text-red-200 text-sm">
              Danger Zone
            </h4>
          </div>
          <p className="text-xs text-red-700/80 dark:text-red-300/80 leading-relaxed">
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
