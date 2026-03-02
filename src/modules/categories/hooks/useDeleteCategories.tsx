import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const service = new CategoriesService();

  return useMutation({
    mutationFn: async (id: string) => {
      await service.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};