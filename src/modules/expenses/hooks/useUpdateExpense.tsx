// hooks/expenses/useUpdateExpense.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { toast } from "sonner";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const service = new ExpensesService();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
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