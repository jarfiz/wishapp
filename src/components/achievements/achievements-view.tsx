"use client";

import * as React from "react";
import { type CurrencyCode } from "@/lib/money";
import { Money } from "@/components/ui/money";
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
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-amber-50/30 p-6 sm:p-10 shadow-sm dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#141620] dark:via-[#10121B] dark:to-[#0A0B10] dark:shadow-2xl transition-all">
        {/* Subtle luminous ambient mesh glow */}
        <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-400/15" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20 backdrop-blur-md">
              <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Personal Milestones & Achievement Hall</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Your Journey & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              A celebration of consistency, courage, and tangible dreams accomplished. Every badge is permanently unlocked through genuine action.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50/80 dark:bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md font-bold">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                Total XP Earned
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalXp} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Achievement Badges
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {unlockedAchievements.length} / {ALL_ACHIEVEMENTS_LIST.length} Unlocked
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Completed Purchases
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {completedWishes.length} Acquired
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#11131B] transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Completed Life Quests
          </span>
          <div className="mt-2 text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            {completedGoals.length} Conquered
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
                  className={`relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200 ${
                    isUnlocked
                      ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 shadow-xs dark:border-amber-400/25 dark:bg-[#141620]"
                      : "border-slate-200/50 bg-slate-50/40 opacity-55 dark:border-white/[0.05] dark:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isUnlocked
                        ? "bg-amber-500/15 text-amber-600 shadow-xs dark:bg-amber-400/15 dark:text-amber-400 border border-amber-500/20"
                        : "bg-slate-200/80 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
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
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {ach.title}
                      </h3>
                      <Badge
                        variant={isUnlocked ? "amber" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        +{ach.xp} XP
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ach.description}
                    </p>

                    {isUnlocked ? (
                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-1">
                        Unlocked on{" "}
                        {new Date(unlockInfo!.unlockedAt).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 pt-1 font-medium">
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-4 shadow-xs"
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
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Purchased on{" "}
                        {item.purchasedAt
                          ? new Date(item.purchasedAt).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[11px] uppercase font-medium text-muted-foreground block">
                        Actual Spending
                      </span>
                      <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {item.actualPrice ? (
                          <Money amount={item.actualPrice} currency={currency} />
                        ) : (
                          "Not recorded"
                        )}
                      </span>
                    </div>

                    {item.estimatedPrice ? (
                      <div className="border-l border-border pl-4">
                        <span className="text-[11px] uppercase font-medium text-muted-foreground block">
                          Original Estimate
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          <Money amount={item.estimatedPrice} currency={currency} />
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20">
              <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                No purchases completed yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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
                  className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="emerald">Completed</Badge>
                        <span className="text-xs text-muted-foreground">
                          {goal.completedAt
                            ? new Date(goal.completedAt).toLocaleDateString()
                            : "Achieved"}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-foreground">
                        {goal.title}
                      </h3>
                      {goal.description ? (
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {goal.reflection ? (
                    <div className="rounded-xl bg-muted/40 p-4 border border-border/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5" />
                        <span>Personal Reflection</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
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
