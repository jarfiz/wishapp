"use client";

import * as React from "react";
import { formatMoney, type CurrencyCode } from "@/lib/money";
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md border border-indigo-400/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Your Life Goals & Aspirations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting} ✨
            </h2>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              &ldquo;Dream about it. Plan for it. Work toward it. Achieve it.&rdquo; Every small step brings your future vision closer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setQuickAddOpen(true)}
              className="bg-white text-indigo-950 hover:bg-zinc-100 shadow-md font-semibold gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-indigo-600" />
              <span>Capture a Wish</span>
            </Button>
            <Link href="/vision-board">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm cursor-pointer"
              >
                <span>Vision Board</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient decorative backdrop glows */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-40 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Financial Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Remaining Cost */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">
              Remaining Cost
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              {formatMoney(financialSummary.remainingEstimatedCost, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Across {financialSummary.totalActiveCount} unpurchased wishes
            </p>
          </div>
        </div>

        {/* Total Wishlist Value */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Wishlist Value
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              {formatMoney(financialSummary.activeEstimatedTotal, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Sum of all known estimates
            </p>
          </div>
        </div>

        {/* Recorded Savings */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">
              Recorded Savings
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              {formatMoney(totalSavingsRecorded, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Across active savings plans
            </p>
          </div>
        </div>

        {/* Completed Goals & Purchases */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">
              Achievements Won
            </span>
            <div className="rounded-xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {financialSummary.purchasedCount + completedGoalsCount} Done
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {financialSummary.purchasedCount} purchases, {completedGoalsCount} goals
            </p>
          </div>
        </div>
      </div>

      {/* Warning Alert if some items have unknown prices */}
      {financialSummary.hasIncompleteEstimates ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold">Note on Financial Estimates: </span>
            You have {financialSummary.unknownEstimatesCount} wish{financialSummary.unknownEstimatesCount > 1 ? "es" : ""} without an estimated price. Items with missing prices are not treated as free; totals will update as soon as you record estimated costs!
          </div>
        </div>
      ) : null}

      {/* Two Column Section: Featured Goal & Savings Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Life Goal Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Compass className="h-4 w-4" />
                <span>Featured Life Quest</span>
              </span>
              <Link
                href="/goals"
                className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1"
              >
                <span>All Goals ({activeGoalsCount})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {featuredGoal ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {featuredGoal.title}
                  </h3>
                  {featuredGoal.description ? (
                    <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {featuredGoal.description}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                      Milestones ({featuredGoal.completedMilestones} / {featuredGoal.totalMilestones})
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {featuredGoal.progressPercent}%
                    </span>
                  </div>
                  <Progress value={featuredGoal.progressPercent} />
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center py-6 text-center text-zinc-400">
                <Compass className="h-8 w-8 text-zinc-300 stroke-[1.5] mb-2" />
                <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  No active goals created yet.
                </p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
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
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <PiggyBank className="h-4 w-4" />
                <span>Savings Progress</span>
              </span>
              <Link
                href="/savings"
                className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1"
              >
                <span>View Plans</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {activeSavingsPlans.length > 0 ? (
              <div className="mt-4 space-y-4">
                {activeSavingsPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                        {plan.displayName}
                      </span>
                      <span className="text-zinc-500 tabular-nums">
                        {formatMoney(plan.projection.totalSaved, currency)} /{" "}
                        {formatMoney(plan.projection.targetAmount, currency)}
                      </span>
                    </div>
                    <Progress
                      value={plan.projection.percentageSaved}
                      indicatorClassName="bg-emerald-600 dark:bg-emerald-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center py-6 text-center text-zinc-400">
                <PiggyBank className="h-8 w-8 text-zinc-300 stroke-[1.5] mb-2" />
                <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  No active savings plans yet.
                </p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
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
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Approaching Deadlines & Targets</span>
            </h3>
          </div>

          {upcomingTargets.length > 0 ? (
            <div className="space-y-3">
              {upcomingTargets.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.estimatedPrice
                          ? formatMoney(item.estimatedPrice, currency)
                          : "Price unestimated"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : "No date"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No upcoming target dates scheduled. Add target dates to keep yourself accountable!
            </div>
          )}
        </div>

        {/* Recently Added Wishes */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span>Recently Added Wishes</span>
            </h3>
            <Link
              href="/wishlist"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentWishes.length > 0 ? (
            <div className="space-y-3">
              {recentWishes.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.status === "purchased" ? (
                          <span className="text-emerald-600 font-medium">Purchased</span>
                        ) : item.estimatedPrice ? (
                          formatMoney(item.estimatedPrice, currency)
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
            <div className="py-8 text-center text-xs text-zinc-400">
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
