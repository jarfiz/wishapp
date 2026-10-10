import { db } from "@/lib/db";
import { userAchievements } from "@/lib/db/schema";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { eq, and } from "drizzle-orm";

export interface UnlockResult {
  unlocked: boolean;
  achievementKey?: string;
  title?: string;
  xpEarned?: number;
}

export async function checkAndAwardAchievement(
  userId: string,
  key: string
): Promise<UnlockResult> {
  const def = ACHIEVEMENTS[key];
  if (!def) return { unlocked: false };

  try {
    // Check if already awarded (idempotent)
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementKey, key)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { unlocked: false };
    }

    // Insert new achievement
    await db.insert(userAchievements).values({
      userId,
      achievementKey: key,
      xpEarned: def.xp,
      unlockedAt: new Date(),
    });

    return {
      unlocked: true,
      achievementKey: key,
      title: def.title,
      xpEarned: def.xp,
    };
  } catch (error) {
    console.error(`Error awarding achievement ${key} to user ${userId}:`, error);
    return { unlocked: false };
  }
}
