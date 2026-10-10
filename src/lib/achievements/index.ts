export interface AchievementDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  category: "wishlist" | "goals" | "savings" | "general";
}

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  first_step: {
    key: "first_step",
    title: "First Step",
    description: "Added your first item to your wishlist.",
    icon: "Sparkles",
    xp: 50,
    category: "wishlist",
  },
  planner: {
    key: "planner",
    title: "Planner",
    description: "Created your very first life goal or quest.",
    icon: "Compass",
    xp: 50,
    category: "goals",
  },
  first_purchase: {
    key: "first_purchase",
    title: "First Purchase",
    description: "Marked your first wishlist item as purchased.",
    icon: "ShoppingBag",
    xp: 100,
    category: "wishlist",
  },
  dream_achieved: {
    key: "dream_achieved",
    title: "Dream Achieved",
    description: "Completed your first life goal.",
    icon: "Trophy",
    xp: 150,
    category: "goals",
  },
  consistent_saver: {
    key: "consistent_saver",
    title: "Consistent Saver",
    description: "Recorded savings contributions across multiple dates.",
    icon: "PiggyBank",
    xp: 100,
    category: "savings",
  },
  visionary: {
    key: "visionary",
    title: "Visionary",
    description: "Added a dream to your personal vision board.",
    icon: "Eye",
    xp: 50,
    category: "general",
  },
  explorer: {
    key: "explorer",
    title: "Explorer",
    description: "Completed an experience-based goal without a financial price.",
    icon: "MapPin",
    xp: 100,
    category: "goals",
  },
  milestone_master: {
    key: "milestone_master",
    title: "Milestone Master",
    description: "Completed at least 5 individual goal milestones.",
    icon: "CheckCircle2",
    xp: 75,
    category: "goals",
  },
  big_saver: {
    key: "big_saver",
    title: "Big Saver",
    description: "Saved more than 50% towards any savings goal.",
    icon: "TrendingUp",
    xp: 100,
    category: "savings",
  },
  goal_crusher: {
    key: "goal_crusher",
    title: "Goal Crusher",
    description: "Completed 3 or more life goals.",
    icon: "Flame",
    xp: 200,
    category: "goals",
  },
};

export const ALL_ACHIEVEMENTS_LIST = Object.values(ACHIEVEMENTS);
