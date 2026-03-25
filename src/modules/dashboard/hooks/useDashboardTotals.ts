import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";

const fetchTotal = async (table: 'expenses' | 'incomes', userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from(table)
    .select('amount_in_base')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount_in_base), 0);
};

export const useDashboardTotals = () => {
  const { user } = useAuth();

  const { data: totalExpenses = 0, isLoading: loadingExpenses } = useQuery({
    queryKey: ['dashboard-total-expenses', user?.id],
    queryFn: () => fetchTotal('expenses', user!.id),
    enabled: !!user,
  });

  const { data: totalIncome = 0, isLoading: loadingIncome } = useQuery({
    queryKey: ['dashboard-total-income', user?.id],
    queryFn: () => fetchTotal('incomes', user!.id),
    enabled: !!user,
  });

  return {
    totalExpenses,
    totalIncome,
    balance: totalIncome - totalExpenses,
    isLoading: loadingExpenses || loadingIncome,
  };
};
