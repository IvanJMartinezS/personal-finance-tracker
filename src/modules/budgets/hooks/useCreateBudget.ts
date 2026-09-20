import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetsService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";
import type { CreateBudgetInput } from "@/types";

const budgetsService = new BudgetsService();

export const useCreateBudget = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: Omit<CreateBudgetInput, "user_id">) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await budgetsService.createBudget({ ...budgetData, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
