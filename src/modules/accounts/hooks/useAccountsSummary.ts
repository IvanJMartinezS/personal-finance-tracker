import { useMemo } from "react";
import { useGetAccounts } from "./useGetAccounts";
import { useGetSnapshots } from "./useGetSnapshots";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";
import type { Account, AccountSnapshot } from "../utils/types";

/**
 * Convierte el saldo de una cuenta a USD.
 * - USD: el mismo monto, no hace falta tasa.
 * - Cualquier otra moneda: se divide por `rate` (la tasa dada al registrar
 *   ese saldo — ver UpsertSnapshotDialog, donde es obligatoria). Si el
 *   snapshot no tiene una tasa registrada (solo puede pasar en saldos
 *   guardados antes de que existiera este campo), no hay forma confiable de
 *   convertir → `null`. No se usa ninguna tasa fija de referencia para
 *   adivinarlo.
 */
export function toUSD(amount: number, currency: string, rate?: number | null): number | null {
  if (currency === "USD") return amount;
  if (!rate) return null;
  return amount / rate;
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
    let usd = 0, cop = 0, ves = 0, copUSD = 0, totalUSD = 0;
    for (const acc of accounts ?? []) {
      const snap = snapshotMap[acc.id]?.[currentMonth];
      if (!snap) continue;
      // Se convierte cuenta por cuenta (no el agregado de una sola vez), para
      // no perder la precisión de las cuentas que sí tienen una tasa propia
      // registrada. Sin tasa registrada, esa cuenta no aporta al total USD
      // (en vez de estimarla con una tasa fija).
      const converted = toUSD(snap.amount, acc.currency, snap.exchange_rate) ?? 0;
      if (acc.currency === "USD") usd += snap.amount;
      else if (acc.currency === "COP") { cop += snap.amount; copUSD += converted; }
      else ves += snap.amount;
      totalUSD += converted;
    }
    return { usd, cop, ves, copUSD, totalUSD };
  }, [accounts, snapshotMap, currentMonth]);

  // Totales mensuales en USD para la tabla de historial
  const monthlyTotals = useMemo(() => {
    return Array.from({ length: currentMonth }, (_, i) => {
      const m = i + 1;
      let total = 0;
      for (const acc of accounts ?? []) {
        const snap = snapshotMap[acc.id]?.[m];
        if (snap) total += toUSD(snap.amount, acc.currency, snap.exchange_rate) ?? 0;
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
