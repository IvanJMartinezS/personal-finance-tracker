import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IncomesService } from "../service";

const incomesService = new IncomesService();

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incomesService.deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast.success("Ingreso eliminado");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
