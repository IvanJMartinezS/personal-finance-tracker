import { useQuery } from "@tanstack/react-query";
import { ExpensesService } from "@/modules/expenses/service/index";
import { useAuth } from "@/shared/auth/useAuth";

const expensesService = new ExpensesService();

export const useGetExpenses = (limit?: number, currentPage: number = 1) => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryFn: () => expensesService.getExpenses(user?.id, limit, currentPage),
    queryKey: ["expenses", user?.id, limit, currentPage],
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
