import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";

const categoriesService = new CategoriesService();

export const useGetCategories = (type?: 'expense' | 'income', limit?: number, currentPage: number = 1) => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryFn: () => categoriesService.getCategories(type, user?.id, limit, currentPage),
    queryKey: ["categories", user?.id, type, limit, currentPage],
    enabled: !!user,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    limit: data?.limit || limit,
    page: data?.page || currentPage,
    isLoading,
  };
};
