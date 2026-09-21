import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { BudgetsService } from "../service";
import { ExpensesService } from "@/modules/expenses/service";
import { calculateBudgetUsage, type BudgetUsage } from "../utils/calculateBudgetUsage";
import type { Budget } from "@/types";

const budgetsService = new BudgetsService();
const expensesService = new ExpensesService();

export interface BudgetWithUsage extends BudgetUsage {
  budget: Budget;
}

/**
 * Presupuestos del usuario junto con cuánto se ha gastado (en USD) de cada
 * uno en `year`-`month`. Usado por el widget de presupuesto del dashboard.
 */
export const useBudgetsUsage = (year: number, month: number) => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["budgets-usage", user?.id, year, month],
    enabled: !!user,
    queryFn: async (): Promise<BudgetWithUsage[]> => {
      const [budgets, spentByCategory] = await Promise.all([
        budgetsService.getBudgets(user!.id),
        expensesService.getMonthCategoryTotalsUSD(user!.id, year, month),
      ]);

      return budgets.map((budget) => {
        const spentUSD = spentByCategory[budget.category_id] ?? 0;
        return { budget, ...calculateBudgetUsage(budget.amount_usd, spentUSD) };
      });
    },
  });

  return { data: data ?? [], isLoading };
};
