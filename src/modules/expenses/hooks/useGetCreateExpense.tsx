// hooks/expenses/useCreateExpense.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { useAuth } from "@/shared/auth/useAuth";
import { toast } from "sonner";

export const useCreateExpense = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const service = new ExpensesService();

  return useMutation({
    mutationFn: async (expenseData: {
      date: string;
      category_id: string;
      item: string;
      amount: number;
      currency: string;
      exchange_rate: number;
      amount_in_base: number;
      notes?: string;
    }) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await service.createExpense({ ...expenseData, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Gasto registrado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};