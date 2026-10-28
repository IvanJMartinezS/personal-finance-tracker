import type { BudgetMonthlyAmount } from "@/types";

/**
 * Resuelve qué monto de presupuesto regía en un mes puntual: la entrada de
 * `monthlyAmounts` más reciente con `year`/`month` ≤ el mes consultado (un
 * ajuste hecho en noviembre aplica a noviembre y a todos los meses
 * siguientes, hasta el próximo ajuste). Si no hay ninguna entrada aplicable
 * todavía, cae en `defaultAmountUsd` — el monto actual del presupuesto,
 * mismo comportamiento que antes de que existiera este historial.
 */
export function resolveBudgetAmountForMonth(
  defaultAmountUsd: number,
  monthlyAmounts: BudgetMonthlyAmount[] | undefined,
  year: number,
  month: number,
): number {
  const targetKey = year * 12 + month;
  let resolved = defaultAmountUsd;
  let bestKey = -Infinity;

  for (const entry of monthlyAmounts ?? []) {
    const entryKey = entry.year * 12 + entry.month;
    if (entryKey <= targetKey && entryKey > bestKey) {
      resolved = entry.amount_usd;
      bestKey = entryKey;
    }
  }

  return resolved;
}
