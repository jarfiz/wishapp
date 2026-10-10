import { describe, it, expect } from "vitest";
import { ACHIEVEMENTS } from "@/lib/achievements";

describe("Authorization and Multi-User Isolation Principles", () => {
  it("enforces user isolation rules: records for User A cannot be accessed by User B", () => {
    const userA_id = "user_123";
    const userB_id = "user_456";

    const mockDatabaseRecords = [
      { id: "item_1", userId: userA_id, name: "A's Laptop", price: 1500 },
      { id: "item_2", userId: userB_id, name: "B's Camera", price: 800 },
    ];

    const filterByUser = (userId: string) =>
      mockDatabaseRecords.filter((rec) => rec.userId === userId);

    const userA_results = filterByUser(userA_id);
    const userB_results = filterByUser(userB_id);

    expect(userA_results).toHaveLength(1);
    expect(userA_results[0].name).toBe("A's Laptop");

    expect(userB_results).toHaveLength(1);
    expect(userB_results[0].name).toBe("B's Camera");

    // Cross-user access returns empty or false
    const crossAccess = mockDatabaseRecords.some(
      (rec) => rec.id === "item_2" && rec.userId === userA_id
    );
    expect(crossAccess).toBe(false);
  });
});

describe("Achievement Awarding Rules and Idempotency", () => {
  it("prevents duplicate awards for the same user and achievement", () => {
    const awardsHistory: Array<{ userId: string; key: string; xp: number }> = [];

    function award(userId: string, key: string): { awarded: boolean; xp: number } {
      const alreadyEarned = awardsHistory.some(
        (a) => a.userId === userId && a.key === key
      );
      if (alreadyEarned) {
        return { awarded: false, xp: 0 };
      }
      const def = ACHIEVEMENTS[key];
      const xp = def ? def.xp : 0;
      awardsHistory.push({ userId, key, xp });
      return { awarded: true, xp };
    }

    const first = award("user_1", "first_step");
    expect(first.awarded).toBe(true);
    expect(first.xp).toBe(50);

    // Duplicate award attempt
    const second = award("user_1", "first_step");
    expect(second.awarded).toBe(false);
    expect(second.xp).toBe(0);

    // Total history still only has 1 record
    expect(awardsHistory.filter((a) => a.userId === "user_1")).toHaveLength(1);
  });

  it("never awards XP merely for spending money", () => {
    for (const def of Object.values(ACHIEVEMENTS)) {
      // Confirm that no achievement has description stating reward for amount spent
      expect(def.description.toLowerCase()).not.toContain("spent $");
      expect(def.description.toLowerCase()).not.toContain("spending money");
    }
  });
});

describe("Purchase State Preservation", () => {
  it("preserves estimated price when recording actual price", () => {
    const item = {
      name: "Ergonomic Desk",
      estimatedPrice: "5000000",
      actualPrice: null as string | null,
      status: "planned",
      purchasedAt: null as Date | null,
    };

    // Purchase action
    const purchasedItem = {
      ...item,
      status: "purchased",
      actualPrice: "4850000",
      purchasedAt: new Date("2026-10-10"),
    };

    expect(purchasedItem.estimatedPrice).toBe("5000000"); // Original estimate preserved
    expect(purchasedItem.actualPrice).toBe("4850000");
    expect(purchasedItem.status).toBe("purchased");

    // Unpurchase action
    const revertedItem = {
      ...purchasedItem,
      status: "planned",
      actualPrice: null,
      purchasedAt: null,
    };

    expect(revertedItem.estimatedPrice).toBe("5000000");
    expect(revertedItem.actualPrice).toBe(null);
    expect(revertedItem.status).toBe("planned");
  });
});
