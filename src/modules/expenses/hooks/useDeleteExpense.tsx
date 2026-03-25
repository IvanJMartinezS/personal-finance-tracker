import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { toast } from "sonner";

const expensesService = new ExpensesService();

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Gasto eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
