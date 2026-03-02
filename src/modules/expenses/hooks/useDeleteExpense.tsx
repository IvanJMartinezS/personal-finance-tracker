// hooks/expenses/useDeleteExpense.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { toast } from "sonner";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const service = new ExpensesService();

  return useMutation({
    mutationFn: async (id: string) => {
      await service.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Gasto eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};