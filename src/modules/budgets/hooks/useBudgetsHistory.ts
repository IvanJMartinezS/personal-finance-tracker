import { useMemo } from "react";
import { useGetBudgets } from "./useGetBudgets";
import { useYearlySummary } from "@/modules/summary/hooks/useYearlySummary";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";
import { calculateBudgetHistory, type CategoryBudgetHistory } from "../utils/calculateBudgetHistory";

/**
 * Historial mensual de "cuánto quedó disponible" por categoría presupuestada
 * en `year`, con el acumulado corriendo desde que se creó cada presupuesto.
 * Reutiliza los mismos datos que ya trae `useYearlySummary` (gasto por
 * categoría y mes) — no hace ninguna consulta adicional a la base de datos.
 */
export const useBudgetsHistory = (year: number) => {
  const { data: budgets, isLoading: budgetsLoading } = useGetBudgets();
  const { data: yearlySummary, isLoading: summaryLoading } = useYearlySummary(year);
  const elapsedMonths = getElapsedMonthsInYear(year);

  const data = useMemo<CategoryBudgetHistory[]>(() => {
    if (!yearlySummary) return [];

    const monthlySpentByCategory: Record<number, Record<string, number>> = {};
    for (let m = 1; m <= elapsedMonths; m++) {
      const byCategory = yearlySummary.months[m]?.byCategory ?? {};
      monthlySpentByCategory[m] = Object.fromEntries(
        Object.entries(byCategory).map(([catId, totals]) => [catId, totals.amountUSD])
      );
    }

    return calculateBudgetHistory(budgets, monthlySpentByCategory, year, elapsedMonths);
  }, [budgets, yearlySummary, year, elapsedMonths]);

  return { data, isLoading: budgetsLoading || summaryLoading };
};
