"use client";

import * as React from "react";
import { formatMoney, type CurrencyCode } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PiggyBank,
  Plus,
  Clock,
  Trash2,
  History,
} from "lucide-react";
import { SavingsPlanDialog } from "./savings-plan-dialog";
import { SavingsEntryDialog } from "./savings-entry-dialog";
import { deleteSavingsPlan, deleteSavingsEntry } from "@/lib/actions/savings";
import { toast } from "sonner";
import type { SavingsPlan, WishlistItem, Goal, SavingsEntry } from "@/types";

interface SavingsViewProps {
  initialPlans: SavingsPlan[];
  wishlistItems: WishlistItem[];
  goals: Goal[];
  currency?: CurrencyCode;
}

export function SavingsView({
  initialPlans,
  wishlistItems,
  goals,
  currency = "IDR",
}: SavingsViewProps) {
  const [createPlanOpen, setCreatePlanOpen] = React.useState(false);
  const [addEntryOpen, setAddEntryOpen] = React.useState(false);
  const [activePlanForEntry, setActivePlanForEntry] = React.useState<SavingsPlan | null>(null);

  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Delete savings plan for "${name}"?`)) return;
    try {
      await deleteSavingsPlan(id);
      toast.success("Savings plan deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete plan";
      toast.error(msg);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteSavingsEntry(entryId);
      toast.success("Contribution entry deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete entry";
      toast.error(msg);
    }
  };

  const handleOpenAddContribution = (plan: SavingsPlan) => {
    setActivePlanForEntry(plan);
    setAddEntryOpen(true);
  };

  // Grand totals
  const totalTarget = initialPlans.reduce(
    (acc, p) => acc + (p.projection.targetAmount || 0),
    0
  );
  const totalSaved = initialPlans.reduce(
    (acc, p) => acc + (p.projection.totalSaved || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <PiggyBank className="h-3.5 w-3.5" />
            <span>Savings Projection Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Savings Planner & Progress
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
            Build discipline with tangible targets, recorded deposits, and realistic timeline projections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreatePlanOpen(true)}
            size="sm"
            className="gap-1.5 shadow-sm shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>New Savings Target</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Target Across Plans
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
            {formatMoney(totalTarget, currency)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Total Saved So Far
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatMoney(totalSaved, currency)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Plans
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {initialPlans.length} Active
          </div>
        </div>
      </div>

      {/* Plans List */}
      {initialPlans.length > 0 ? (
        <div className="space-y-6">
          {initialPlans.map((plan) => (
            <div
              key={plan.id}
              className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] space-y-6 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                    <PiggyBank className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {plan.displayName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {formatMoney(plan.projection.targetAmount, currency)}
                      </span>
                      {plan.plannedMonthlyContribution ? (
                        <span>
                          {" "}
                          • Planned Monthly:{" "}
                          {formatMoney(plan.plannedMonthlyContribution, currency)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenAddContribution(plan)}
                    size="sm"
                    className="gap-1.5 shadow-sm shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Money</span>
                  </Button>
                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.displayName)}
                    className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                    title="Delete plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Projection bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    Saved: {formatMoney(plan.projection.totalSaved, currency)} (
                    {plan.projection.percentageSaved}%)
                  </span>
                  <span className="text-slate-500 tabular-nums font-medium">
                    Remaining:{" "}
                    {formatMoney(plan.projection.remainingAmount, currency)}
                  </span>
                </div>
                <Progress
                  value={plan.projection.percentageSaved}
                  indicatorClassName="bg-emerald-500 dark:bg-emerald-400"
                />

                {/* Projection notice */}
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {plan.projection.isComplete ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Target achieved! Ready for purchase! 🎉
                    </span>
                  ) : plan.projection.monthsRemaining !== null ? (
                    <span>
                      Estimated time to target:{" "}
                      <strong className="text-slate-800 dark:text-slate-200">
                        ~{plan.projection.monthsRemaining} month
                        {plan.projection.monthsRemaining > 1 ? "s" : ""}
                      </strong>{" "}
                      at planned contribution rate.
                    </span>
                  ) : (
                    <span>
                      Add a planned monthly contribution to project completion timeline.
                    </span>
                  )}
                </div>
              </div>

              {/* Contribution History Table / Accordion */}
              {plan.entries.length > 0 ? (
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                    <History className="h-3.5 w-3.5" />
                    <span>Contribution History ({plan.entries.length})</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {plan.entries.map((entry: SavingsEntry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04] text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            +{formatMoney(entry.amount, currency)}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          {entry.note ? (
                            <span className="text-slate-600 dark:text-slate-400 italic">
                              &ldquo;{entry.note}&rdquo;
                            </span>
                          ) : null}
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="rounded p-1 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.09] bg-white/40 dark:bg-[#11131B]/40 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
            <PiggyBank className="h-7 w-7 stroke-[1.5]" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            No savings targets yet
          </h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Select an item from your wishlist or a life goal to set a target amount and monthly projection.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setCreatePlanOpen(true)}
              size="sm"
              className="gap-1.5 shadow-sm shadow-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Savings Plan</span>
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <SavingsPlanDialog
        open={createPlanOpen}
        onOpenChange={setCreatePlanOpen}
        wishlistItems={wishlistItems}
        goals={goals}
        currencySymbol={currency}
      />

      <SavingsEntryDialog
        open={addEntryOpen}
        onOpenChange={setAddEntryOpen}
        plan={activePlanForEntry}
        currencySymbol={currency}
      />
    </div>
  );
}
