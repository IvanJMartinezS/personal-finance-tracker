import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { IncomesService } from "../service";


export const useGetIncomes = (limit?: number, currentPage: number = 1) => {
  const { user } = useAuth();
  const service = new IncomesService();

  const list = async () => {
    const result = await service.getIncomes( user?.id, limit, currentPage);
    return result;
  };

  const { data, isLoading } = useQuery({
    queryFn: list,
    queryKey:["incomes", user?.id, limit, currentPage],
    enabled: !!user,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    limit: data?.limit || limit,
    page: data?.page || currentPage,
    isLoading,
  }
};