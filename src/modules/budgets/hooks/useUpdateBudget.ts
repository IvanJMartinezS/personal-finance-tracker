import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetsService } from "../service";
import { buildBudgetAmountUpdates } from "../utils/buildBudgetAmountUpdates";
import type { Budget } from "@/types";

const budgetsService = new BudgetsService();

interface UpdateBudgetPayload {
  budget: Budget;
  newAmountUsd: number;
}

/**
 * Edita el monto de un presupuesto sin reescribir los meses que ya pasaron:
 * además de actualizar `budgets.amount_usd` (el valor "actual"), guarda el
 * ajuste correspondiente en `budget_monthly_amounts` — ver
 * `buildBudgetAmountUpdates` para el detalle de qué filas se escriben.
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budget, newAmountUsd }: UpdateBudgetPayload) => {
      const monthlyUpdates = buildBudgetAmountUpdates(budget, newAmountUsd, new Date());
      const [updated] = await Promise.all([
        budgetsService.updateBudget(budget.id, { amount_usd: newAmountUsd }),
        budgetsService.upsertMonthlyAmounts(budget.id, budget.user_id, monthlyUpdates),
      ]);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-usage"] });
    },
  });
};
