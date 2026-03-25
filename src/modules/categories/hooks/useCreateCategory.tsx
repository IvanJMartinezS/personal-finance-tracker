import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";
import { toast } from "sonner";
import type { CreateCategory } from "@/types";

const categoriesService = new CategoriesService();

export const useCreateCategory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategory) => {
      if (!user) throw new Error("Usuario no autenticado");
      return await categoriesService.createCategory(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
