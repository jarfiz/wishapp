export type CurrencyCode = "IDR" | "USD" | "EUR" | "GBP" | "SGD" | "JPY";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  fractionDigits: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    fractionDigits: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    fractionDigits: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    fractionDigits: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    fractionDigits: 2,
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    locale: "en-SG",
    fractionDigits: 2,
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    fractionDigits: 0,
  },
};

/**
 * Formats a monetary amount into the specified currency representation.
 */
export function formatMoney(
  amount: number | string | null | undefined,
  currency: CurrencyCode = "IDR"
): string {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return "-";
  }

  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.IDR;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: config.fractionDigits,
      maximumFractionDigits: config.fractionDigits,
    }).format(num);
  } catch {
    return `${config.symbol} ${num.toLocaleString(config.locale)}`;
  }
}

/**
 * Parse an input amount safely to a normalized number or null if invalid/empty.
 */
export function parseMoneyInput(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  const str = val.trim();
  if (!str) return null;

  let normalized = str.replace(/[^0-9.,-]/g, "");
  if (!normalized) return null;

  const dotCount = (normalized.match(/\./g) || []).length;
  const commaCount = (normalized.match(/,/g) || []).length;

  // Multiple dots -> dots are thousand separators (e.g. 1.500.000)
  if (dotCount > 1) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (dotCount === 1 && commaCount === 0) {
    // If ends with 3 digits, like 1.500 or 1500.000, consider dot thousand separator in IDR context
    const parts = normalized.split(".");
    if (parts[1] && parts[1].length === 3 && parts[0].length <= 3) {
      normalized = parts[0] + parts[1];
    }
  } else if (commaCount > 0 && dotCount === 0) {
    // Single or multiple commas
    if (commaCount > 1) {
      normalized = normalized.replace(/,/g, "");
    } else {
      const parts = normalized.split(",");
      if (parts[1] && parts[1].length === 3) {
        normalized = parts[0] + parts[1];
      } else {
        normalized = normalized.replace(",", ".");
      }
    }
  } else if (commaCount > 0 && dotCount > 0) {
    // Standard 1,500.00 vs 1.500,00
    if (normalized.lastIndexOf(".") > normalized.lastIndexOf(",")) {
      normalized = normalized.replace(/,/g, "");
    } else {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    }
  }

  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

/**
 * Calculates financial summary metrics for a list of wishlist items.
 */
export interface WishlistFinancialSummary {
  activeEstimatedTotal: number;
  remainingEstimatedCost: number;
  recordedPurchaseSpending: number;
  purchasedWithoutActualPriceCount: number;
  unknownEstimatesCount: number;
  totalActiveCount: number;
  purchasedCount: number;
  hasIncompleteEstimates: boolean;
}

export interface WishlistItemForSummary {
  estimatedPrice?: string | number | null;
  actualPrice?: string | number | null;
  status: "idea" | "planned" | "saving" | "purchased" | "archived" | string;
}

export function calculateWishlistSummary(
  items: WishlistItemForSummary[]
): WishlistFinancialSummary {
  let activeEstimatedTotal = 0;
  let remainingEstimatedCost = 0;
  let recordedPurchaseSpending = 0;
  let purchasedWithoutActualPriceCount = 0;
  let unknownEstimatesCount = 0;
  let totalActiveCount = 0;
  let purchasedCount = 0;

  for (const item of items) {
    if (item.status === "archived") {
      continue;
    }

    const isPurchased = item.status === "purchased";
    const estNum =
      item.estimatedPrice !== null && item.estimatedPrice !== undefined
        ? parseFloat(String(item.estimatedPrice))
        : null;
    const hasValidEst = estNum !== null && !isNaN(estNum) && estNum >= 0;

    const actNum =
      item.actualPrice !== null && item.actualPrice !== undefined
        ? parseFloat(String(item.actualPrice))
        : null;
    const hasValidAct = actNum !== null && !isNaN(actNum) && actNum >= 0;

    if (isPurchased) {
      purchasedCount++;
      if (hasValidAct) {
        recordedPurchaseSpending += actNum;
      } else {
        purchasedWithoutActualPriceCount++;
      }
      if (hasValidEst) {
        activeEstimatedTotal += estNum;
      }
    } else {
      totalActiveCount++;
      if (hasValidEst) {
        activeEstimatedTotal += estNum;
        remainingEstimatedCost += estNum;
      } else {
        unknownEstimatesCount++;
      }
    }
  }

  return {
    activeEstimatedTotal,
    remainingEstimatedCost,
    recordedPurchaseSpending,
    purchasedWithoutActualPriceCount,
    unknownEstimatesCount,
    totalActiveCount,
    purchasedCount,
    hasIncompleteEstimates: unknownEstimatesCount > 0,
  };
}

/**
 * Calculates savings plan progress and monthly time projections.
 */
export interface SavingsPlanProjection {
  targetAmount: number;
  totalSaved: number;
  remainingAmount: number;
  percentageSaved: number;
  monthlyContribution: number | null;
  monthsRemaining: number | null;
  isComplete: boolean;
}

export function calculateSavingsProjection(
  targetAmount: number | string | null | undefined,
  entries: Array<{ amount: number | string | null | undefined }>,
  plannedMonthlyContribution?: number | string | null | undefined
): SavingsPlanProjection {
  const target = Math.max(0, parseFloat(String(targetAmount || 0)) || 0);

  let totalSaved = 0;
  for (const entry of entries) {
    const val = parseFloat(String(entry.amount || 0));
    if (!isNaN(val) && val > 0) {
      totalSaved += val;
    }
  }

  const remainingAmount = Math.max(0, target - totalSaved);
  const percentageSaved = target > 0 ? Math.min(100, Math.round((totalSaved / target) * 100)) : 0;
  const isComplete = target > 0 && totalSaved >= target;

  const monthly = plannedMonthlyContribution
    ? parseFloat(String(plannedMonthlyContribution))
    : null;
  const hasValidMonthly = monthly !== null && !isNaN(monthly) && monthly > 0;

  let monthsRemaining: number | null = null;
  if (target > 0) {
    if (hasValidMonthly && remainingAmount > 0) {
      monthsRemaining = Math.ceil(remainingAmount / monthly);
    } else if (remainingAmount === 0) {
      monthsRemaining = 0;
    }
  }

  return {
    targetAmount: target,
    totalSaved,
    remainingAmount,
    percentageSaved,
    monthlyContribution: hasValidMonthly ? monthly : null,
    monthsRemaining,
    isComplete,
  };
}
