"use client";

import * as React from "react";
import { formatDualMoney, type CurrencyCode } from "@/lib/money";
import { useExchangeRates } from "@/components/currency-provider";
import { cn } from "@/lib/utils";

interface MoneyProps {
  amount: number | string | null | undefined;
  currency?: CurrencyCode;
  className?: string;
  secondaryClassName?: string;
  fallback?: string;
}

export function Money({
  amount,
  currency = "IDR",
  className,
  secondaryClassName,
  fallback = "-",
}: MoneyProps) {
  const rates = useExchangeRates();
  const formatted = formatDualMoney(amount, currency, rates);

  if (!formatted.isValid) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 tabular-nums",
        className
      )}
    >
      <span>{formatted.primary}</span>
      <span
        className={cn(
          "text-[0.76em] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap",
          secondaryClassName
        )}
      >
        {currency !== "USD" && currency !== "IDR"
          ? `(${formatted.usd} · ${formatted.idr})`
          : `(${formatted.secondary})`}
      </span>
    </span>
  );
}

