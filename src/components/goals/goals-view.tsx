"use client";

import * as React from "react";
import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Compass } from "lucide-react";
import { type CurrencyCode } from "@/lib/money";
import type { Goal, Category } from "@/types";

interface GoalsViewProps {
  initialGoals: Goal[];
  categories: Category[];
  currency?: CurrencyCode;
}

export function GoalsView({
  initialGoals,
  categories,
  currency = "IDR",
}: GoalsViewProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("active");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);

  const filteredGoals = React.useMemo(() => {
    return initialGoals.filter((g) => {
      if (statusFilter !== "all" && g.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchDesc = g.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [initialGoals, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setDialogOpen(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search goals & quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="active">Active Goals</option>
            <option value="all">All Goals</option>
            <option value="completed">Completed Quests</option>
            <option value="paused">Paused</option>
          </select>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </Button>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={currency}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200/90 bg-white/50 p-12 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Compass className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {search.trim() ? "No matching goals found" : "No goals found"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Group your dreams into life goals (e.g. &ldquo;Visit Norway&rdquo;, &ldquo;Build My Dream Setup&rdquo;, &ldquo;Learn Full-Stack Development&rdquo;).
          </p>
          <div className="mt-6">
            <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Create Your First Goal</span>
            </Button>
          </div>
        </div>
      )}

      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={editingGoal}
        categories={categories}
        currencySymbol={currency}
      />
    </div>
  );
}
