import { useQuery } from "@tanstack/react-query";
import { BudgetsService } from "../service";
import { useAuth } from "@/shared/auth/useAuth";

const budgetsService = new BudgetsService();

export const useGetBudgets = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryFn: () => budgetsService.getBudgets(user?.id),
    queryKey: ["budgets", user?.id],
    enabled: !!user,
  });

  // Orden alfabético por nombre de categoría — no hay una columna propia por
  // la que ordenar en `budgets` (el nombre vive en la categoría relacionada).
  const sorted = [...(data ?? [])].sort((a, b) =>
    (a.categories?.name ?? "").localeCompare(b.categories?.name ?? "")
  );

  return { data: sorted, isLoading };
};
