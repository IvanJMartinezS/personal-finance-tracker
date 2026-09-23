import { toUsdEquivalent } from "@/lib/mock-data";
import { firstApplicableMonth } from "./calculateBudgetHistory";
import type { Budget, Expense } from "@/types";

export interface ExpenseBudgetOverage {
  /** Cuánto de ESTE gasto en particular superó el presupuesto de su categoría ese mes (siempre > 0). */
  excessUSD: number;
  /** Total acumulado superado en esa categoría y mes, hasta este gasto incluido (siempre ≥ excessUSD). */
  cumulativeExcessUSD: number;
}

/**
 * Para cada gasto que, sumado en orden cronológico a los demás gastos de su
 * misma categoría y mes, hizo que se superara el presupuesto de esa
 * categoría, calcula:
 * - cuánto aportó ESE gasto puntual al excedente (`excessUSD`) — parcial si
 *   fue el gasto que cruzó el límite, o el monto completo si el presupuesto
 *   ya estaba superado antes de registrarlo.
 * - el acumulado superado en esa categoría/mes hasta ese punto
 *   (`cumulativeExcessUSD`).
 *
 * Ejemplo: presupuesto de $100, con $80 ya gastados. Un gasto de $20 cruza el
 * límite exacto (excessUSD 0, no aparece). Un gasto de $20 después de eso
 * está 100% por fuera del presupuesto (excessUSD 20, cumulative 20). Un
 * gasto de $40 adicional después: excessUSD 40, cumulative 60.
 *
 * Los gastos sin categoría, sin presupuesto asignado a esa categoría, o de
 * un mes anterior a que el presupuesto existiera, no aparecen en el
 * resultado (no se puede "superar" un presupuesto que no existía).
 */
export function calculateExpenseBudgetOverages(
  expenses: Expense[],
  budgets: Budget[],
): Map<string, ExpenseBudgetOverage> {
  const overages = new Map<string, ExpenseBudgetOverage>();
  const budgetByCategory = new Map(budgets.map((b) => [b.category_id, b]));

  // Agrupar gastos aplicables por categoría + año + mes
  const groups = new Map<string, Expense[]>();
  for (const exp of expenses) {
    if (!exp.category_id) continue;
    const budget = budgetByCategory.get(exp.category_id);
    if (!budget) continue;

    const [year, month] = exp.date.split("-").map(Number);
    const startMonth = firstApplicableMonth(budget.created_at, year);
    if (startMonth === null || month < startMonth) continue;

    const key = `${exp.category_id}|${year}|${month}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(exp);
  }

  for (const [key, groupExpenses] of groups) {
    const categoryId = key.split("|")[0];
    const budget = budgetByCategory.get(categoryId)!;

    // Orden cronológico: por fecha y, dentro del mismo día, por cuándo se creó el registro.
    const sorted = [...groupExpenses].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.created_at.localeCompare(b.created_at);
    });

    let spent = 0;
    for (const exp of sorted) {
      const spentBefore = spent;
      spent += toUsdEquivalent(exp);
      const spentAfter = spent;

      const excessUSD = Math.max(0, spentAfter - Math.max(spentBefore, budget.amount_usd));
      if (excessUSD > 0) {
        const cumulativeExcessUSD = Math.max(0, spentAfter - budget.amount_usd);
        overages.set(exp.id, { excessUSD, cumulativeExcessUSD });
      }
    }
  }

  return overages;
}
