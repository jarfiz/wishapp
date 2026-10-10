"use client";

import * as React from "react";
import { WishCard } from "./wish-card";
import { WishDialog } from "./wish-dialog";
import { QuickAddDialog } from "./quick-add-dialog";
import { PurchaseDialog } from "./purchase-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Sparkles,
  Gift,
} from "lucide-react";
import { type CurrencyCode } from "@/lib/money";
import type { WishlistItem, Category } from "@/types";

interface WishlistViewProps {
  initialItems: WishlistItem[];
  categories: Category[];
  currency?: CurrencyCode;
}

export function WishlistView({
  initialItems,
  categories,
  currency = "IDR",
}: WishlistViewProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("active");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<
    "recent" | "targetDate" | "priceAsc" | "priceDesc" | "name"
  >("recent");

  // Modals state
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [wishDialogOpen, setWishDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<WishlistItem | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);
  const [purchasingItem, setPurchasingItem] = React.useState<WishlistItem | null>(null);

  // Filter & sort logic
  const filteredItems = React.useMemo(() => {
    return initialItems
      .filter((item) => {
        // Status filter
        if (statusFilter === "active" && (item.status === "archived" || item.status === "purchased")) {
          return false;
        }
        if (statusFilter === "purchased" && item.status !== "purchased") {
          return false;
        }
        if (statusFilter === "archived" && item.status !== "archived") {
          return false;
        }
        if (statusFilter === "all" && item.status === "archived") {
          return false; // exclude archived from general 'all'
        }

        // Category filter
        if (categoryFilter !== "all" && item.categoryId !== categoryFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== "all" && item.priority !== priorityFilter) {
          return false;
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchNotes) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "targetDate") {
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        }
        if (sortBy === "priceAsc") {
          const pA = a.estimatedPrice ? Number(a.estimatedPrice) : Infinity;
          const pB = b.estimatedPrice ? Number(b.estimatedPrice) : Infinity;
          return pA - pB;
        }
        if (sortBy === "priceDesc") {
          const pA = a.estimatedPrice ? Number(a.estimatedPrice) : -Infinity;
          const pB = b.estimatedPrice ? Number(b.estimatedPrice) : -Infinity;
          return pB - pA;
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    initialItems,
    search,
    categoryFilter,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setWishDialogOpen(true);
  };

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setWishDialogOpen(true);
  };

  const handlePurchase = (item: WishlistItem) => {
    setPurchasingItem(item);
    setPurchaseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] sm:flex-row sm:items-center sm:justify-between transition-colors">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search wishlist items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="active">Active Wishes</option>
            <option value="all">All (Active + Done)</option>
            <option value="purchased">Purchased</option>
            <option value="archived">Archived</option>
          </select>

          {/* Priority filter */}
          <select
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 transition-colors"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category filter */}
          {categories.length > 0 ? (
            <select
              className="h-9 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 transition-colors"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : null}

          {/* Sort By */}
          <select
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-medium text-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "targetDate" | "priceAsc" | "priceDesc" | "name")}
          >
            <option value="recent">Recently Added</option>
            <option value="targetDate">Target Date</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 p-0.5 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.03]">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid view"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-white/[0.1] dark:text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-white/[0.1] dark:text-white"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 shadow-sm shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            <span>Add Wish</span>
          </Button>
        </div>
      </div>

      {/* Grid or List View */}
      {filteredItems.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <WishCard
                key={item.id}
                item={item}
                currency={currency}
                onEdit={handleEdit}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <WishCard
                key={item.id}
                item={item}
                currency={currency}
                onEdit={handleEdit}
                onPurchase={handlePurchase}
                isCompact
              />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.09] bg-white/40 dark:bg-[#11131B]/40 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
            <Gift className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            {search.trim() ? "No matching wishes found" : "Your wishlist is empty"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {search.trim()
              ? "Try adjusting your search query or filters to find what you are looking for."
              : "Capture things you dream about having or doing. You can add an estimated price or photo anytime later."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => setQuickAddOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <span>Quick Add</span>
            </Button>
            <Button onClick={handleOpenAdd} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add Full Details</span>
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <QuickAddDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        categories={categories}
        currencySymbol={currency}
      />

      <WishDialog
        open={wishDialogOpen}
        onOpenChange={setWishDialogOpen}
        item={editingItem}
        categories={categories}
        currencySymbol={currency}
      />

      <PurchaseDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        item={purchasingItem}
        currency={currency}
      />
    </div>
  );
}
