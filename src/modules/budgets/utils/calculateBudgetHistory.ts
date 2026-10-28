import { calculateBudgetUsage } from "./calculateBudgetUsage";
import { resolveBudgetAmountForMonth } from "./resolveBudgetAmountForMonth";
import type { Budget } from "@/types";

export interface MonthlyBudgetLedgerEntry {
  month: number; // 1-12
  spentUSD: number;
  remainingUSD: number;
  /** Suma de `remainingUSD` desde que el presupuesto empezó a regir hasta este mes. */
  accumulatedUSD: number;
}

export interface CategoryBudgetHistory {
  budget: Budget;
  entries: MonthlyBudgetLedgerEntry[];
}

/**
 * Primer mes de `year` en que un presupuesto creado en `createdAt` ya regía:
 * - `year` anterior al año de creación → el presupuesto no existía aún (`null`).
 * - `year` igual al año de creación → arranca en el mes en que se creó.
 * - `year` posterior al año de creación → arranca en enero (ya regía todo el año).
 *
 * Exportada porque también la usa `calculateExpenseBudgetOverages` — un
 * gasto de un mes anterior a que el presupuesto existiera no puede haberlo
 * "superado".
 */
export function firstApplicableMonth(createdAt: string, year: number): number | null {
  const created = new Date(createdAt);
  const createdYear = created.getFullYear();
  if (year < createdYear) return null;
  if (year === createdYear) return created.getMonth() + 1;
  return 1;
}

/**
 * Historial mensual de "cuánto quedó disponible" por categoría presupuestada,
 * con el acumulado corriendo desde el mes en que se creó cada presupuesto (no
 * desde enero) — un presupuesto agregado en septiembre no aplica
 * retroactivamente a los meses anteriores de ese año.
 *
 * Cada mes se calcula con el monto que REALMENTE regía en ese mes (ver
 * `resolveBudgetAmountForMonth` y 009_create_budget_monthly_amounts.sql) —
 * si el presupuesto cambió de monto en octubre, los meses anteriores a
 * octubre conservan el cálculo con el monto que tenían entonces, no se
 * recalculan con el nuevo.
 *
 * @param budgets - presupuestos actuales del usuario
 * @param monthlySpentByCategory - `mes → categoryId → gastado en USD` (typicamente de `useYearlySummary`)
 * @param year - año consultado (para saber si el presupuesto ya existía)
 * @param elapsedMonths - hasta qué mes del año calcular (ver `getElapsedMonthsInYear`)
 */
export function calculateBudgetHistory(
  budgets: Budget[],
  monthlySpentByCategory: Record<number, Record<string, number>>,
  year: number,
  elapsedMonths: number,
): CategoryBudgetHistory[] {
  return budgets.map((budget) => {
    const startMonth = firstApplicableMonth(budget.created_at, year);
    let accumulatedUSD = 0;
    const entries: MonthlyBudgetLedgerEntry[] = [];

    if (startMonth !== null) {
      for (let month = startMonth; month <= elapsedMonths; month++) {
        const spentUSD = monthlySpentByCategory[month]?.[budget.category_id] ?? 0;
        const amountForMonth = resolveBudgetAmountForMonth(budget.amount_usd, budget.budget_monthly_amounts, year, month);
        const { remainingUSD } = calculateBudgetUsage(amountForMonth, spentUSD);
        accumulatedUSD += remainingUSD;
        entries.push({ month, spentUSD, remainingUSD, accumulatedUSD });
      }
    }

    return { budget, entries };
  });
}
