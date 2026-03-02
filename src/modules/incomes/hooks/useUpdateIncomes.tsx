// hooks/expenses/useUpdateExpense.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IncomesService } from "../service";

export const useUpdateIncomes = () => {
  const queryClient = useQueryClient();
  const service = new IncomesService();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      return await service.updateIncome(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast.success("Ingreso actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};