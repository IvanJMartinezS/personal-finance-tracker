import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";
import { toCopEquivalent } from "@/lib/mock-data";

interface CurrencyTotals {
  usd: number;
  cop: number;
}

/**
 * Suma, para toda la tabla, el total en USD (moneda base, exacto) y en COP
 * (exacto por fila donde se conoce la tasa, estimado donde no — ver
 * `toCopEquivalent`). Suma por fila en vez de convertir el total agregado de
 * una sola vez, para no perder la precisión de las filas que sí tienen una
 * tasa exacta registrada.
 */
const fetchTotals = async (table: 'expenses' | 'incomes', userId: string): Promise<CurrencyTotals> => {
  const { data, error } = await supabase
    .from(table)
    .select('amount, amount_in_base, currency, exchange_rate')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);

  return (data ?? []).reduce(
    (totals, row) => ({
      usd: totals.usd + Number(row.amount_in_base),
      cop: totals.cop + toCopEquivalent(row),
    }),
    { usd: 0, cop: 0 }
  );
};

export const useDashboardTotals = () => {
  const { user } = useAuth();

  const { data: expenseTotals, isLoading: loadingExpenses } = useQuery({
    queryKey: ['dashboard-total-expenses', user?.id],
    queryFn: () => fetchTotals('expenses', user!.id),
    enabled: !!user,
  });

  const { data: incomeTotals, isLoading: loadingIncome } = useQuery({
    queryKey: ['dashboard-total-income', user?.id],
    queryFn: () => fetchTotals('incomes', user!.id),
    enabled: !!user,
  });

  const totalExpensesUSD = expenseTotals?.usd ?? 0;
  const totalExpensesCOP = expenseTotals?.cop ?? 0;
  const totalIncomeUSD = incomeTotals?.usd ?? 0;
  const totalIncomeCOP = incomeTotals?.cop ?? 0;

  return {
    totalExpensesUSD,
    totalExpensesCOP,
    totalIncomeUSD,
    totalIncomeCOP,
    balanceUSD: totalIncomeUSD - totalExpensesUSD,
    balanceCOP: totalIncomeCOP - totalExpensesCOP,
    isLoading: loadingExpenses || loadingIncome,
  };
};
