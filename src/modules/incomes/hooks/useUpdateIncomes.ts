import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IncomesService } from "../service";
import type { Income } from "@/types";

type UpdateIncomePayload = { id: string } & Partial<Omit<Income, "id" | "created_at" | "updated_at">>;

export const useUpdateIncomes = () => {
  const queryClient = useQueryClient();
  const service = new IncomesService();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateIncomePayload) => {
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