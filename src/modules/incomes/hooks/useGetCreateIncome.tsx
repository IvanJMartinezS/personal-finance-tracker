import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { toast } from "sonner";
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
      toast.success("Ingreso registrado");
    },
    onError: (error: any) => {
      if (error.code === '22P02') {
        toast.error("La categoría seleccionada no existe. Por favor, elige una categoría válida.");
      } else {
        toast.error(error.message);
      }
    },
  });
};
