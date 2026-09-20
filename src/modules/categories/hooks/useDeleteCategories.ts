import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";

const categoriesService = new CategoriesService();

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
