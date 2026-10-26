import type { BudgetWithUsage } from "../hooks/useBudgetsUsage";

export interface NetBudgetUsage {
  totalBudgetUSD: number;
  totalSpentUSD: number;
  totalRemainingUSD: number;
}

export function calculateNetBudgetUsage(budgetsUsage: BudgetWithUsage[]): NetBudgetUsage {
  const totalBudgetUSD = budgetsUsage.reduce((sum, b) => sum + b.budget.amount_usd, 0);
  const totalSpentUSD = budgetsUsage.reduce((sum, b) => sum + b.spentUSD, 0);
  return {
    totalBudgetUSD,
    totalSpentUSD,
    totalRemainingUSD: totalBudgetUSD - totalSpentUSD,
  };
}
