import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";
import { toast } from "sonner";
import type { CreateCategory } from "../utils/types";

export const useCreateCategory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const service = new CategoriesService();

  const create = async (data: CreateCategory) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await service.createCategory(user.id, data);
    };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};