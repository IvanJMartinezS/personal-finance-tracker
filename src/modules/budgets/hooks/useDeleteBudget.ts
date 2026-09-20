import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetsService } from "../service";

const budgetsService = new BudgetsService();

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
