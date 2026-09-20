import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { toast } from "sonner";
import type { Expense } from "@/types";

type UpdateExpensePayload = { id: string } & Partial<Omit<Expense, "id" | "created_at" | "updated_at">>;

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const service = new ExpensesService();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateExpensePayload) => {
      return await service.updateExpense(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Gasto actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};