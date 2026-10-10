"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { QuickAddDialog } from "@/components/wishlist/quick-add-dialog";
import { Toaster } from "sonner";
import { X } from "lucide-react";
import type { Category } from "@/types";

interface AppShellProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  categories?: Category[];
  currencySymbol?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AppShell({
  user,
  categories = [],
  currencySymbol = "Rp",
  title = "Overview",
  subtitle,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased font-sans">
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 md:flex-col fixed inset-y-0 z-40">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar
              user={user}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Add Dialog */}
      <QuickAddDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        categories={categories}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
