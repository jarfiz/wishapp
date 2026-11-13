"use client";

import * as React from "react";
import { type CurrencyCode } from "@/lib/money";
import { Money } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Target,
  Trophy,
  PiggyBank,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Gift,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { QuickAddDialog } from "@/components/wishlist/quick-add-dialog";
import type { WishlistItem, Goal, SavingsPlan, Category } from "@/types";

interface OverviewViewProps {
  userName?: string | null;
  currency?: CurrencyCode;
  financialSummary: {
    activeEstimatedTotal: number;
    remainingEstimatedCost: number;
    recordedPurchaseSpending: number;
    purchasedWithoutActualPriceCount: number;
    unknownEstimatesCount: number;
    totalActiveCount: number;
    purchasedCount: number;
    hasIncompleteEstimates: boolean;
  };
  totalSavingsRecorded: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
  recentWishes: WishlistItem[];
  upcomingTargets: WishlistItem[];
  activeSavingsPlans: SavingsPlan[];
  featuredGoal: Goal | null;
  categories: Category[];
}

export function OverviewView({
  userName,
  currency = "IDR",
  financialSummary,
  totalSavingsRecorded,
  activeGoalsCount,
  completedGoalsCount,
  recentWishes,
  upcomingTargets,
  activeSavingsPlans,
  featuredGoal,
  categories,
}: OverviewViewProps) {
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  const greeting = userName ? `Welcome back, ${userName}` : "Welcome to Daymark";

  return (
    <div className="space-y-8">
      {/* Welcome Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#131622] dark:via-[#0F111A] dark:to-[#0A0B10] dark:shadow-2xl transition-all">
        {/* Subtle luminous ambient mesh glow */}
        <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Life Goals & Aspirations Workspace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {greeting} ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              &ldquo;Dream about it. Plan for it. Work toward it. Achieve it.&rdquo; Every small deposit and clear priority brings your aspirations to reality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setQuickAddOpen(true)}
              className="gap-2 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Capture a Wish</span>
            </Button>
            <Link href="/vision-board">
              <Button
                variant="glass"
                className="gap-1.5 cursor-pointer"
              >
                <span>Vision Board</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Remaining Cost */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.07] dark:bg-[#11131B] dark:hover:border-white/[0.14]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Remaining Cost
            </span>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
              <Money amount={financialSummary.remainingEstimatedCost} currency={currency} />
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Across {financialSummary.totalActiveCount} active wishes
            </p>
          </div>
        </div>

        {/* Total Wishlist Value */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.07] dark:bg-[#11131B] dark:hover:border-white/[0.14]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Wishlist Value
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
              <Money amount={financialSummary.activeEstimatedTotal} currency={currency} />
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Sum of all recorded estimates
            </p>
          </div>
        </div>

        {/* Recorded Savings */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.07] dark:bg-[#11131B] dark:hover:border-white/[0.14]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recorded Savings
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              <Money amount={totalSavingsRecorded} currency={currency} />
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Across active savings plans
            </p>
          </div>
        </div>

        {/* Completed Goals & Purchases */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.07] dark:bg-[#11131B] dark:hover:border-white/[0.14]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Milestones Conquered
            </span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {financialSummary.purchasedCount + completedGoalsCount} Won
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {financialSummary.purchasedCount} purchases, {completedGoalsCount} quests
            </p>
          </div>
        </div>
      </div>

      {/* Warning Alert if some items have unknown prices */}
      {financialSummary.hasIncompleteEstimates ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/5 dark:text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold">Estimates Incomplete: </span>
            You have {financialSummary.unknownEstimatesCount} wish{financialSummary.unknownEstimatesCount > 1 ? "es" : ""} without an estimated price. Items without prices are not treated as free; totals will automatically calibrate as soon as you record estimated costs!
          </div>
        </div>
      ) : null}

      {/* Two Column Section: Featured Goal & Savings Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Life Goal Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Compass className="h-4 w-4" />
                <span>Featured Life Quest</span>
              </span>
              <Link
                href="/goals"
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>All Goals ({activeGoalsCount})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {featuredGoal ? (
              <div className="mt-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {featuredGoal.title}
                  </h3>
                  {featuredGoal.description ? (
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {featuredGoal.description}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      Milestones ({featuredGoal.completedMilestones} / {featuredGoal.totalMilestones})
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {featuredGoal.progressPercent}%
                    </span>
                  </div>
                  <Progress value={featuredGoal.progressPercent} />
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-3 border border-indigo-500/20">
                  <Compass className="h-6 w-6 stroke-[1.5]" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No active goals created yet.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Group your dreams into larger quests like &ldquo;Dream Workspace&rdquo; or &ldquo;Visit Japan&rdquo;!
                </p>
                <Link href="/goals" className="mt-4">
                  <Button size="sm" variant="outline">
                    Create Goal
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Savings Tracker Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <PiggyBank className="h-4 w-4" />
                <span>Savings Progress</span>
              </span>
              <Link
                href="/savings"
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>View Plans</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {activeSavingsPlans.length > 0 ? (
              <div className="mt-5 space-y-4">
                {activeSavingsPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                        {plan.displayName}
                      </span>
                      <span className="text-slate-500 tabular-nums font-medium">
                        <Money amount={plan.projection.totalSaved} currency={currency} /> /{" "}
                        <Money amount={plan.projection.targetAmount} currency={currency} />
                      </span>
                    </div>
                    <Progress
                      value={plan.projection.percentageSaved}
                      indicatorClassName="bg-emerald-500 dark:bg-emerald-400"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 mb-3 border border-emerald-500/20">
                  <PiggyBank className="h-6 w-6 stroke-[1.5]" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No active savings plans yet.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Set target amounts and monthly projections for any wish or goal.
                </p>
                <Link href="/savings" className="mt-4">
                  <Button size="sm" variant="outline">
                    Start a Plan
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column: Upcoming Target Dates & Recently Added Wishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Target Dates */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Approaching Deadlines & Targets</span>
            </h3>
          </div>

          {upcomingTargets.length > 0 ? (
            <div className="space-y-2.5">
              {upcomingTargets.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50/80 dark:border-white/[0.05] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {item.estimatedPrice ? (
                          <Money amount={item.estimatedPrice} currency={currency} />
                        ) : (
                          "Price unestimated"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-white/[0.06] dark:text-slate-300">
                      {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : "No date"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No upcoming target dates scheduled. Add target dates to keep yourself accountable!
            </div>
          )}
        </div>

        {/* Recently Added Wishes */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span>Recently Added Wishes</span>
            </h3>
            <Link
              href="/wishlist"
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentWishes.length > 0 ? (
            <div className="space-y-2.5">
              {recentWishes.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50/80 dark:border-white/[0.05] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-400">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {item.status === "purchased" ? (
                          <span className="text-emerald-500 font-semibold">Purchased</span>
                        ) : item.estimatedPrice ? (
                          <Money amount={item.estimatedPrice} currency={currency} />
                        ) : (
                          "Price not set"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px]">
                      {item.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No wishes yet. Click &ldquo;Capture a Wish&rdquo; to add your first dream!
            </div>
          )}
        </div>
      </div>

      <QuickAddDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        categories={categories}
        currencySymbol={currency}
      />
    </div>
  );
}
