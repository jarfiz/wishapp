"use client";

import * as React from "react";
import { formatMoney, type CurrencyCode } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  Gift,
  Coins,
  MapPin,
  TrendingUp,
  Eye,
  Flame,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { ALL_ACHIEVEMENTS_LIST } from "@/lib/achievements";
import type { UserAchievementRecord, WishlistItem, Goal } from "@/types";

interface AchievementsViewProps {
  unlockedAchievements: UserAchievementRecord[];
  completedWishes: WishlistItem[];
  completedGoals: Goal[];
  currency?: CurrencyCode;
}

export function AchievementsView({
  unlockedAchievements,
  completedWishes,
  completedGoals,
  currency = "IDR",
}: AchievementsViewProps) {
  const unlockedMap = React.useMemo(() => {
    const map = new Map<string, { unlockedAt: string | Date; xp: number }>();
    for (const a of unlockedAchievements) {
      map.set(a.achievementKey, {
        unlockedAt: a.unlockedAt,
        xp: a.xpEarned,
      });
    }
    return map;
  }, [unlockedAchievements]);

  const totalXp = unlockedAchievements.reduce(
    (acc, a) => acc + (a.xpEarned || 0),
    0
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return Sparkles;
      case "Compass":
        return Compass;
      case "ShoppingBag":
        return ShoppingBag;
      case "Trophy":
        return Trophy;
      case "PiggyBank":
        return Coins;
      case "Eye":
        return Eye;
      case "MapPin":
        return MapPin;
      case "CheckCircle2":
        return CheckCircle2;
      case "TrendingUp":
        return TrendingUp;
      case "Flame":
        return Flame;
      default:
        return Trophy;
    }
  };

  return (
    <div className="space-y-8">
      {/* Journey Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200 border border-amber-400/20 backdrop-blur-md">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <span>Personal Milestones & Achievements</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Your Journey & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              A celebration of consistency, courage, and tangible dreams accomplished. Every achievement is earned by real action.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-200">
                Total XP Earned
              </span>
              <div className="text-2xl font-black text-white tabular-nums">
                {totalXp} XP
              </div>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-amber-600/20 blur-3xl" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Achievement Badges
          </span>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {unlockedAchievements.length} / {ALL_ACHIEVEMENTS_LIST.length} Unlocked
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Completed Purchases
          </span>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {completedWishes.length} Dreams Acquired
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Completed Life Quests
          </span>
          <div className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            {completedGoals.length} Quests Conquered
          </div>
        </div>
      </div>

      {/* Tabs: Badges, Purchase History, Goal History */}
      <Tabs defaultValue="badges">
        <TabsList className="mb-6">
          <TabsTrigger value="badges">Badges ({unlockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History ({completedWishes.length})</TabsTrigger>
          <TabsTrigger value="goals">Achieved Goals ({completedGoals.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Badges */}
        <TabsContent value="badges">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_ACHIEVEMENTS_LIST.map((ach) => {
              const unlockInfo = unlockedMap.get(ach.key);
              const isUnlocked = Boolean(unlockInfo);
              const Icon = getIcon(ach.icon);

              return (
                <div
                  key={ach.key}
                  className={`relative flex items-start gap-4 rounded-2xl border p-5 transition-all ${
                    isUnlocked
                      ? "border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-xs dark:border-amber-900/40 dark:bg-zinc-900/80"
                      : "border-zinc-200/60 bg-zinc-50/50 opacity-60 dark:border-zinc-800/60 dark:bg-zinc-900/20"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isUnlocked
                        ? "bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-950 dark:text-amber-400"
                        : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    {isUnlocked ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold truncate ${
                          isUnlocked
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-500"
                        }`}
                      >
                        {ach.title}
                      </h3>
                      <Badge
                        variant={isUnlocked ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        +{ach.xp} XP
                      </Badge>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {ach.description}
                    </p>

                    {isUnlocked ? (
                      <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400 pt-1">
                        Unlocked on{" "}
                        {new Date(unlockInfo!.unlockedAt).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-400 pt-1">
                        Locked
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Completed Purchases */}
        <TabsContent value="purchases">
          {completedWishes.length > 0 ? (
            <div className="space-y-3">
              {completedWishes.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Purchased on{" "}
                        {item.purchasedAt
                          ? new Date(item.purchasedAt).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[11px] uppercase font-medium text-zinc-400 block">
                        Actual Spending
                      </span>
                      <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {item.actualPrice
                          ? formatMoney(item.actualPrice, currency)
                          : "Not recorded"}
                      </span>
                    </div>

                    {item.estimatedPrice ? (
                      <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
                        <span className="text-[11px] uppercase font-medium text-zinc-400 block">
                          Original Estimate
                        </span>
                        <span className="text-xs text-zinc-500 tabular-nums">
                          {formatMoney(item.estimatedPrice, currency)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <Gift className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                No purchases completed yet.
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Mark items on your wishlist as purchased to record your milestone history!
              </p>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Completed Goals */}
        <TabsContent value="goals">
          {completedGoals.length > 0 ? (
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Completed</Badge>
                        <span className="text-xs text-zinc-400">
                          {goal.completedAt
                            ? new Date(goal.completedAt).toLocaleDateString()
                            : "Achieved"}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        {goal.title}
                      </h3>
                      {goal.description ? (
                        <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                          {goal.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {goal.reflection ? (
                    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5" />
                        <span>Personal Reflection</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                        &ldquo;{goal.reflection.whatAchieved}&rdquo;
                      </p>
                      {goal.reflection.whyImportant ? (
                        <p className="text-xs text-zinc-500">
                          <strong>Why it mattered:</strong> {goal.reflection.whyImportant}
                        </p>
                      ) : null}
                      {goal.reflection.whatLearned ? (
                        <p className="text-xs text-zinc-500">
                          <strong>Learned:</strong> {goal.reflection.whatLearned}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <Compass className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                No goals marked completed yet.
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Conquer your quests and celebrate your progress here!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
