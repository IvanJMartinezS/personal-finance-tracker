import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import type { CreateIncomeInput } from "@/types";
import { IncomesService } from "../service";

const incomesService = new IncomesService();

export const useCreateIncome = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (incomeData: Omit<CreateIncomeInput, 'user_id'>) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await incomesService.createIncome({ ...incomeData, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};
