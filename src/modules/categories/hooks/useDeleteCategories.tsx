import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { toast } from "sonner";

const categoriesService = new CategoriesService();

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
