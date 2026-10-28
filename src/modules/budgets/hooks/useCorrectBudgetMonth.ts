import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetsService } from "../service";

const budgetsService = new BudgetsService();

interface CorrectBudgetMonthPayload {
  budgetId: string;
  userId: string;
  year: number;
  month: number;
  amountUsd: number;
}

/**
 * Corrige el monto de un presupuesto en UN mes puntual ya pasado — a
 * diferencia de `useUpdateBudget` (que cambia el monto "de ahora en
 * adelante" y actualiza `budgets.amount_usd`), esto solo toca esa fila de
 * `budget_monthly_amounts`, sin afectar el monto actual ni ningún otro mes.
 */
export const useCorrectBudgetMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, userId, year, month, amountUsd }: CorrectBudgetMonthPayload) => {
      await budgetsService.upsertMonthlyAmounts(budgetId, userId, [{ year, month, amount_usd: amountUsd }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-usage"] });
    },
  });
};
