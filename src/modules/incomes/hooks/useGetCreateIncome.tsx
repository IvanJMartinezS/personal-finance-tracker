import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { toast } from "sonner";
import type { CreateIncomeInput } from "../utils/types";
import { IncomesService } from "../service";

export const useCreateIncome = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const service = new IncomesService();

  const create = async (incomeData: Omit<CreateIncomeInput, 'user_id'>) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await service.createIncome({ ...incomeData, user_id: user.id });
    };

  return useMutation({
    mutationFn: create,
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