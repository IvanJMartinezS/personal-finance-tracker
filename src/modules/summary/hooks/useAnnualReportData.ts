import { useMemo } from "react";
import { useYearlySummary } from "./useYearlySummary";
import { useGetIncomes } from "@/modules/incomes/hooks/useGetIncomes";
import { useBudgetsHistory } from "@/modules/budgets/hooks/useBudgetsHistory";
import { useAccountsSummary } from "@/modules/accounts/hooks/useAccountsSummary";
import { toCopEquivalent, toUsdEquivalent } from "@/lib/mock-data";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";
import type { Category } from "@/types";

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  usd: number;
  cop: number;
}

/**
 * Agrega todo lo que necesita el reporte anual en PDF (Resumen Anual):
 * totales del año, gastos e ingresos por categoría, la matriz mensual de
 * gastos (igual a la que ya se ve en pantalla), el historial de presupuesto,
 * y las cuentas — reutilizando los hooks que ya existen para cada página, sin
 * ninguna consulta nueva a la base de datos.
 */
export const useAnnualReportData = (year: number) => {
  const { data: yearlySummary, isLoading: summaryLoading } = useYearlySummary(year);
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();
  const { data: budgetsHistory, isLoading: budgetsLoading } = useBudgetsHistory(year);
  const accountsSummary = useAccountsSummary(year);

  const elapsedMonths = getElapsedMonthsInYear(year);

  // Gastos por categoría, sumados en todo el año (no mes a mes) — se derivan
  // de la misma matriz mensual que ya usa la página de Resumen.
  const expenseCategoryTotals = useMemo<CategoryTotal[]>(() => {
    if (!yearlySummary) return [];
    const totals = new Map<string, CategoryTotal>();
    for (const cat of yearlySummary.categories as Category[]) {
      totals.set(cat.id, { categoryId: cat.id, name: cat.name, color: cat.color, usd: 0, cop: 0 });
    }
    for (let m = 1; m <= elapsedMonths; m++) {
      const byCategory = yearlySummary.months[m]?.byCategory ?? {};
      for (const [catId, data] of Object.entries(byCategory)) {
        const entry = totals.get(catId) ?? { categoryId: catId, name: "Sin categoría", color: "#888888", usd: 0, cop: 0 };
        entry.usd += data.amountUSD;
        entry.cop += data.amountCOP;
        totals.set(catId, entry);
      }
    }
    return [...totals.values()].filter((c) => c.usd !== 0 || c.cop !== 0).sort((a, b) => b.usd - a.usd);
  }, [yearlySummary, elapsedMonths]);

  // Ingresos por categoría del año — los ingresos no tienen su propio hook de
  // resumen anual (a diferencia de gastos), así que se agregan aquí a partir
  // de todos los ingresos del usuario, filtrando por año.
  const incomeCategoryTotals = useMemo<CategoryTotal[]>(() => {
    const totals = new Map<string, CategoryTotal>();
    for (const inc of incomes ?? []) {
      if (!inc.date.startsWith(`${year}-`)) continue;
      const catId = inc.category_id ?? "uncategorized";
      const cat = inc.categories;
      const entry = totals.get(catId) ?? {
        categoryId: catId,
        name: cat?.name ?? "Sin categoría",
        color: cat?.color ?? "#888888",
        usd: 0,
        cop: 0,
      };
      entry.usd += toUsdEquivalent(inc);
      entry.cop += toCopEquivalent(inc) ?? 0;
      totals.set(catId, entry);
    }
    return [...totals.values()].sort((a, b) => b.usd - a.usd);
  }, [incomes, year]);

  const totals = useMemo(() => {
    const incomeUSD = incomeCategoryTotals.reduce((sum, c) => sum + c.usd, 0);
    const incomeCOP = incomeCategoryTotals.reduce((sum, c) => sum + c.cop, 0);
    const expenseUSD = expenseCategoryTotals.reduce((sum, c) => sum + c.usd, 0);
    const expenseCOP = expenseCategoryTotals.reduce((sum, c) => sum + c.cop, 0);
    return {
      incomeUSD, incomeCOP, expenseUSD, expenseCOP,
      balanceUSD: incomeUSD - expenseUSD,
      balanceCOP: incomeCOP - expenseCOP,
    };
  }, [incomeCategoryTotals, expenseCategoryTotals]);

  return {
    year,
    elapsedMonths,
    generatedAt: new Date(),
    totals,
    expenseCategoryTotals,
    incomeCategoryTotals,
    monthlySummary: yearlySummary ?? { categories: [], months: {} },
    budgetsHistory,
    accounts: accountsSummary.accounts,
    accountCurrentTotals: accountsSummary.currentTotals,
    accountSnapshotMap: accountsSummary.snapshotMap,
    accountCurrentMonth: accountsSummary.currentMonth,
    isLoading: summaryLoading || incomesLoading || budgetsLoading || accountsSummary.isLoading,
  };
};
