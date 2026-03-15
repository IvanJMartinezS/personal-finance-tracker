import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";

export const useGetCategories = (type?: 'expense' | 'income', limit?: number, currentPage: number = 1) => {
  const { user } = useAuth();
  const service = new CategoriesService();

  const list = async () => {
    const result = await service.getCategories( type,user?.id, limit, currentPage);
    return result;
  };

  const { data, isLoading } = useQuery({
    queryFn: list,
    queryKey:["categories", user?.id, limit, currentPage],
    enabled: !!user,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    limit: data?.limit || limit,
    page: data?.page || currentPage,
    isLoading,
  };
}