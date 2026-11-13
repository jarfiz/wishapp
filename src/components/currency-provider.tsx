"use client";

import * as React from "react";
import { DEFAULT_RATES_FROM_USD, type CurrencyCode } from "@/lib/money";

const CurrencyContext = React.createContext<Record<CurrencyCode, number>>(
  DEFAULT_RATES_FROM_USD
);

let cachedRates: Record<CurrencyCode, number> | null = null;
let fetchPromise: Promise<Record<CurrencyCode, number>> | null = null;

async function loadRates(): Promise<Record<CurrencyCode, number>> {
  if (cachedRates) return cachedRates;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/exchange-rates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rates) {
          cachedRates = data.rates;
          return data.rates as Record<CurrencyCode, number>;
        }
        return DEFAULT_RATES_FROM_USD;
      })
      .catch(() => DEFAULT_RATES_FROM_USD)
      .finally(() => {
        fetchPromise = null;
      });
  }
  return fetchPromise;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = React.useState<Record<CurrencyCode, number>>(
    () => cachedRates || DEFAULT_RATES_FROM_USD
  );

  React.useEffect(() => {
    let active = true;
    loadRates().then((loaded) => {
      if (active) setRates(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <CurrencyContext.Provider value={rates}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useExchangeRates() {
  return React.useContext(CurrencyContext);
}
