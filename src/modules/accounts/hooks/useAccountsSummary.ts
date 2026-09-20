import { useMemo } from "react";
import { useGetAccounts } from "./useGetAccounts";
import { useGetSnapshots } from "./useGetSnapshots";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";
import { REFERENCE_USD_TO_COP_RATE } from "@/lib/mock-data";
import type { Account, AccountSnapshot } from "../utils/types";

export function toUSD(amount: number, currency: string, rate = REFERENCE_USD_TO_COP_RATE): number {
  if (currency === "USD") return amount;
  if (currency === "COP") return amount / rate;
  return 0; // VES — no reliable conversion without stored rate
}

export function fmtUSD(val: number): string {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calcula los totales y agrupaciones que necesita la página de cuentas
 * (tarjetas resumen, listado por moneda, historial mensual) a partir de las
 * cuentas y sus snapshots. Separado de `AccountsPage` para que la página se
 * enfoque en el layout y esta lógica se pueda probar/reutilizar aparte.
 */
export const useAccountsSummary = (year: number) => {
  const currentMonth = getElapsedMonthsInYear(year);
  const { data: accounts, isLoading: loadingAccounts } = useGetAccounts();
  const { data: snapshots, isLoading: loadingSnapshots } = useGetSnapshots(year);

  // Lookup: accountId → month → snapshot
  const snapshotMap = useMemo(() => {
    const map: Record<string, Record<number, AccountSnapshot>> = {};
    for (const s of snapshots ?? []) {
      if (!map[s.account_id]) map[s.account_id] = {};
      map[s.account_id][s.month] = s;
    }
    return map;
  }, [snapshots]);

  // Totales del mes actual por moneda
  const currentTotals = useMemo(() => {
    let usd = 0, cop = 0, ves = 0;
    for (const acc of accounts ?? []) {
      const snap = snapshotMap[acc.id]?.[currentMonth];
      if (!snap) continue;
      if (acc.currency === "USD") usd += snap.amount;
      else if (acc.currency === "COP") cop += snap.amount;
      else ves += snap.amount;
    }
    return { usd, cop, ves, totalUSD: usd + cop / REFERENCE_USD_TO_COP_RATE };
  }, [accounts, snapshotMap, currentMonth]);

  // Totales mensuales en USD para la tabla de historial
  const monthlyTotals = useMemo(() => {
    return Array.from({ length: currentMonth }, (_, i) => {
      const m = i + 1;
      let total = 0;
      for (const acc of accounts ?? []) {
        const snap = snapshotMap[acc.id]?.[m];
        if (snap) total += toUSD(snap.amount, acc.currency);
      }
      return { month: m, totalUSD: total };
    });
  }, [accounts, snapshotMap, currentMonth]);

  // Cuentas agrupadas por moneda para el listado
  const grouped = useMemo(() => {
    const g: Record<string, Account[]> = { USD: [], COP: [], VES: [] };
    for (const acc of accounts ?? []) {
      g[acc.currency]?.push(acc);
    }
    return g;
  }, [accounts]);

  return {
    year,
    currentMonth,
    accounts: accounts ?? [],
    snapshotMap,
    currentTotals,
    monthlyTotals,
    grouped,
    isLoading: loadingAccounts || loadingSnapshots,
  };
};
