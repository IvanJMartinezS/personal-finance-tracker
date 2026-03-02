import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IncomesService } from "../service";

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();
  const service = new IncomesService();

  return useMutation({
    mutationFn: async (id: string) => {
      await service.deleteIncome(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast.success("Ingreso eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};