import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import type { Category } from "@/types";

const categoriesService = new CategoriesService();

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) => {
      return await categoriesService.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};