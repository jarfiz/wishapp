import { NextResponse } from "next/server";
import { DEFAULT_RATES_FROM_USD, type CurrencyCode } from "@/lib/money";

export const revalidate = 3600;

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Exchange rate fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    const apiRates = data?.rates;

    if (!apiRates || typeof apiRates.IDR !== "number") {
      throw new Error("Invalid exchange rate payload");
    }

    const rates: Record<CurrencyCode, number> = {
      USD: 1,
      IDR: apiRates.IDR ?? DEFAULT_RATES_FROM_USD.IDR,
      EUR: apiRates.EUR ?? DEFAULT_RATES_FROM_USD.EUR,
      GBP: apiRates.GBP ?? DEFAULT_RATES_FROM_USD.GBP,
      SGD: apiRates.SGD ?? DEFAULT_RATES_FROM_USD.SGD,
      JPY: apiRates.JPY ?? DEFAULT_RATES_FROM_USD.JPY,
    };

    return NextResponse.json({
      rates,
      source: "live",
      updatedAt: data.time_last_update_utc || new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      rates: DEFAULT_RATES_FROM_USD,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    });
  }
}
