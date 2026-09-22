import type { Budget } from "@/types";

/** Suma el monto (USD) de todos los presupuestos dados. */
export function sumBudgetsUSD(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.amount_usd, 0);
}
