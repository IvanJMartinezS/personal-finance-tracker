import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IncomesService } from "../service";

const incomesService = new IncomesService();

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incomesService.deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};
