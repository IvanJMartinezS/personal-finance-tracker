import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { useAuth } from "@/shared/auth/useAuth";
import type { CreateExpenseInput } from "@/types";

const expensesService = new ExpensesService();

export const useCreateExpense = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: Omit<CreateExpenseInput, 'user_id'>) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await expensesService.createExpense({ ...expenseData, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
