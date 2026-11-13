import { describe, it, expect } from "vitest";
import {
  calculateWishlistSummary,
  calculateSavingsProjection,
  formatMoney,
  parseMoneyInput,
  convertCurrency,
  formatDualMoney,
  DEFAULT_RATES_FROM_USD,
} from "@/lib/money";
import {
  wishlistItemSchema,
  quickAddWishlistSchema,
  savingsPlanSchema,
  goalSchema,
} from "@/lib/validations";
import { ACHIEVEMENTS } from "@/lib/achievements";

describe("Financial and Wishlist Price Calculations", () => {
  it("calculates active estimate, remaining cost, and purchase spending correctly", () => {
    const items = [
      { estimatedPrice: 1000000, actualPrice: null, status: "planned" },
      { estimatedPrice: 2500000, actualPrice: null, status: "idea" },
      { estimatedPrice: 500000, actualPrice: 480000, status: "purchased" },
      { estimatedPrice: 300000, actualPrice: null, status: "archived" },
    ];

    const summary = calculateWishlistSummary(items);

    // Active estimated total: 1000000 + 2500000 + 500000 = 4000000
    expect(summary.activeEstimatedTotal).toBe(4000000);
    // Remaining estimated cost: 1000000 + 2500000 = 3500000 (purchased excluded)
    expect(summary.remainingEstimatedCost).toBe(3500000);
    // Recorded purchase spending: 480000
    expect(summary.recordedPurchaseSpending).toBe(480000);
    expect(summary.purchasedCount).toBe(1);
    expect(summary.totalActiveCount).toBe(2);
    expect(summary.unknownEstimatesCount).toBe(0);
    expect(summary.hasIncompleteEstimates).toBe(false);
  });

  it("handles unknown/missing prices transparently without treating them as zero", () => {
    const items = [
      { estimatedPrice: null, actualPrice: null, status: "idea" },
      { estimatedPrice: undefined, actualPrice: null, status: "planned" },
      { estimatedPrice: 1500000, actualPrice: null, status: "saving" },
    ];

    const summary = calculateWishlistSummary(items);

    expect(summary.activeEstimatedTotal).toBe(1500000);
    expect(summary.remainingEstimatedCost).toBe(1500000);
    expect(summary.unknownEstimatesCount).toBe(2);
    expect(summary.hasIncompleteEstimates).toBe(true);
  });

  it("handles purchased items without recorded actual price separately", () => {
    const items = [
      { estimatedPrice: 500000, actualPrice: null, status: "purchased" },
      { estimatedPrice: 700000, actualPrice: 650000, status: "purchased" },
    ];

    const summary = calculateWishlistSummary(items);

    expect(summary.purchasedCount).toBe(2);
    expect(summary.recordedPurchaseSpending).toBe(650000);
    expect(summary.purchasedWithoutActualPriceCount).toBe(1);
    expect(summary.remainingEstimatedCost).toBe(0);
  });

  it("formats IDR, USD and currency values cleanly", () => {
    expect(formatMoney(1500000, "IDR")).toContain("1.500.000");
    expect(formatMoney(250.5, "USD")).toContain("250.50");
    expect(formatMoney(null, "IDR")).toBe("-");
    expect(formatMoney(undefined, "USD")).toBe("-");
  });

  it("safely parses user money inputs", () => {
    expect(parseMoneyInput("Rp 1.500.000")).toBe(1500000);
    expect(parseMoneyInput("$ 450.50")).toBe(450.5);
    expect(parseMoneyInput("")).toBe(null);
    expect(parseMoneyInput(null)).toBe(null);
  });
});

describe("Savings Projections and Contributions", () => {
  it("calculates saved percentage, remaining amount, and months to goal", () => {
    const target = 3000000;
    const entries = [{ amount: 500000 }, { amount: 500000 }];
    const monthlyContribution = 500000;

    const projection = calculateSavingsProjection(target, entries, monthlyContribution);

    expect(projection.targetAmount).toBe(3000000);
    expect(projection.totalSaved).toBe(1000000);
    expect(projection.remainingAmount).toBe(2000000);
    expect(projection.percentageSaved).toBe(33);
    // 2000000 remaining / 500000 monthly = 4 months
    expect(projection.monthsRemaining).toBe(4);
    expect(projection.isComplete).toBe(false);
  });

  it("handles empty contributions and zero targets safely without divide-by-zero", () => {
    const projection = calculateSavingsProjection(0, [], 0);
    expect(projection.percentageSaved).toBe(0);
    expect(projection.monthsRemaining).toBe(null);
    expect(projection.remainingAmount).toBe(0);
  });

  it("marks completed when target is met or exceeded", () => {
    const projection = calculateSavingsProjection(1000000, [{ amount: 1200000 }], 500000);
    expect(projection.isComplete).toBe(true);
    expect(projection.remainingAmount).toBe(0);
    expect(projection.percentageSaved).toBe(100);
    expect(projection.monthsRemaining).toBe(0);
  });
});

describe("Goal Progress Calculations", () => {
  it("calculates progress from completed milestones correctly", () => {
    const milestones = [
      { id: "1", isCompleted: true },
      { id: "2", isCompleted: true },
      { id: "3", isCompleted: false },
      { id: "4", isCompleted: false },
    ];

    const total = milestones.length;
    const completed = milestones.filter((m) => m.isCompleted).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    expect(progress).toBe(50);
  });

  it("does not report completed if goal has zero milestones", () => {
    const milestones: { isCompleted: boolean }[] = [];
    const total = milestones.length;
    const completed = milestones.filter((m) => m.isCompleted).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    expect(progress).toBe(0);
  });
});

describe("Input Validations with Zod", () => {
  it("validates savings plan input", () => {
    const valid = savingsPlanSchema.safeParse({
      targetAmount: 5000000,
      monthlyContribution: 500000,
    });
    expect(valid.success).toBe(true);
  });
  it("validates quick-add wishlist item with only a name (all other fields optional)", () => {
    const valid = quickAddWishlistSchema.safeParse({ name: "Mechanical Keyboard" });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.priority).toBe("medium");
      expect(valid.data.estimatedPrice).toBeUndefined();
    }
  });

  it("fails quick-add wishlist item if name is empty", () => {
    const invalid = quickAddWishlistSchema.safeParse({ name: "" });
    expect(invalid.success).toBe(false);
  });

  it("validates complete wishlist item with dates and price", () => {
    const valid = wishlistItemSchema.safeParse({
      name: "Ergonomic Chair",
      estimatedPrice: 3500000,
      priority: "high",
      status: "planned",
      targetDate: "2026-12-31",
      onVisionBoard: true,
    });
    expect(valid.success).toBe(true);
  });

  it("validates goal input without financial target (experience-based)", () => {
    const valid = goalSchema.safeParse({
      title: "Visit Mount Bromo",
      description: "Watch sunrise with friends",
      status: "active",
      onVisionBoard: true,
    });
    expect(valid.success).toBe(true);
  });
});

describe("Achievement Registry Integrity", () => {
  it("contains all required achievements with valid keys, descriptions, and XP values", () => {
    const requiredKeys = [
      "first_step",
      "planner",
      "first_purchase",
      "dream_achieved",
      "consistent_saver",
      "visionary",
      "explorer",
      "milestone_master",
      "big_saver",
      "goal_crusher",
    ];

    for (const key of requiredKeys) {
      expect(ACHIEVEMENTS[key]).toBeDefined();
      expect(ACHIEVEMENTS[key].title).toBeTruthy();
      expect(ACHIEVEMENTS[key].xp).toBeGreaterThan(0);
    }
  });
});

describe("Dual Currency Conversion and Formatting", () => {
  const testRates = {
    ...DEFAULT_RATES_FROM_USD,
    USD: 1,
    IDR: 16000,
  };

  it("converts between IDR and USD accurately", () => {
    expect(convertCurrency(1600000, "IDR", "USD", testRates)).toBe(100);
    expect(convertCurrency(50, "USD", "IDR", testRates)).toBe(800000);
    expect(convertCurrency(250000, "IDR", "IDR", testRates)).toBe(250000);
  });

  it("formats dual money with IDR primary and USD secondary", () => {
    const dual = formatDualMoney(1600000, "IDR", testRates);
    expect(dual.isValid).toBe(true);
    expect(dual.secondaryCurrency).toBe("USD");
    expect(dual.primary).toContain("1.600.000");
    expect(dual.secondary).toBe("$100.00");
  });

  it("formats dual money with USD primary and IDR secondary", () => {
    const dual = formatDualMoney(100, "USD", testRates);
    expect(dual.isValid).toBe(true);
    expect(dual.secondaryCurrency).toBe("IDR");
    expect(dual.primary).toBe("$100.00");
    expect(dual.secondary).toContain("1.600.000");
  });

  it("handles null or invalid amounts gracefully", () => {
    const dual = formatDualMoney(null, "IDR", testRates);
    expect(dual.isValid).toBe(false);
    expect(dual.primary).toBe("-");
    expect(dual.secondary).toBe("-");
  });
});
