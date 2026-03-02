import { useQuery } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { useAuth } from "@/shared/auth/useAuth";


export const useGetExpenses = () => {
  const { user } = useAuth();
  const service = new ExpensesService();
  const currentPage = 1;
  const limit = 10;

  const list = async () => {
    const result = await service.getExpenses( user?.id, limit, currentPage);
    return result;
  };

  const { data, isLoading } = useQuery({
    queryFn: list,
    queryKey:["expenses", limit, currentPage],
    enabled: !!user,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    limit: data?.limit || limit,
    page: data?.page || currentPage,
    isLoading,
  }
}