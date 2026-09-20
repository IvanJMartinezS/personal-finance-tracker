import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetsService } from "../service";
import type { Budget } from "@/types";

const budgetsService = new BudgetsService();

type UpdateBudgetPayload = { id: string } & Partial<Omit<Budget, "id" | "user_id" | "created_at" | "updated_at" | "categories">>;

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateBudgetPayload) => {
      return await budgetsService.updateBudget(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
