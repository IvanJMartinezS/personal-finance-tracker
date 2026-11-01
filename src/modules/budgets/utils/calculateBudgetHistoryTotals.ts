import type { CategoryBudgetHistory } from "./calculateBudgetHistory";

export interface MonthlyBudgetTotal {
  month: number;
  remainingUSD: number;
  accumulatedUSD: number;
}

/**
 * Suma "Disponible" y "Acumulado" de todas las categorías presupuestadas,
 * mes a mes — para la fila de "Total" al final de la tabla de Historial
 * mensual. Una categoría sin entrada ese mes (todavía no existía su
 * presupuesto) simplemente no aporta nada a ese mes, no cuenta como 0
 * disponible.
 */
export function calculateBudgetHistoryTotals(
  data: CategoryBudgetHistory[],
  months: number[],
): MonthlyBudgetTotal[] {
  return months.map((month) => {
    let remainingUSD = 0;
    let accumulatedUSD = 0;

    for (const { entries } of data) {
      const entry = entries.find((e) => e.month === month);
      if (entry) {
        remainingUSD += entry.remainingUSD;
        accumulatedUSD += entry.accumulatedUSD;
      }
    }

    return { month, remainingUSD, accumulatedUSD };
  });
}
