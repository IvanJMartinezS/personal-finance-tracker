import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { IncomesService } from "../service";

const incomesService = new IncomesService();

export const useGetIncomes = (limit?: number, currentPage: number = 1) => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryFn: () => incomesService.getIncomes(user?.id, limit, currentPage),
    queryKey: ["incomes", user?.id, limit, currentPage],
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
