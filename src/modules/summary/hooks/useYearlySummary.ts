import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";
import type { Category } from "@/types";

const YEAR = 2026;

export interface MonthlyCategoryData {
  amountCOP: number;
  amountUSD: number;
}

export interface MonthSummary {
  byCategory: Record<string, MonthlyCategoryData>;
  totalCOP: number;
  totalUSD: number;
}

export interface YearlySummary {
  categories: Category[];
  // key: month number 1-12
  months: Record<number, MonthSummary>;
}

const emptyMonth = (): MonthSummary => ({
  byCategory: {},
  totalCOP: 0,
  totalUSD: 0,
});

export const useYearlySummary = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["yearly-summary", user?.id, YEAR],
    enabled: !!user,
    queryFn: async (): Promise<YearlySummary> => {
      // Fetch all expense categories for this user
      const { data: cats, error: catsError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user!.id)
        .eq("type", "expense")
        .order("name");

      if (catsError) throw new Error(catsError.message);

      // Fetch all expenses for the year
      const { data: expenses, error: expError } = await supabase
        .from("expenses")
        .select("date, amount, amount_in_base, currency, exchange_rate, category_id")
        .eq("user_id", user!.id)
        .gte("date", `${YEAR}-01-01`)
        .lte("date", `${YEAR}-12-31`);

      if (expError) throw new Error(expError.message);

      const categories = (cats ?? []) as Category[];

      // Build month map
      const months: Record<number, MonthSummary> = {};
      for (let m = 1; m <= 12; m++) months[m] = emptyMonth();

      for (const exp of expenses ?? []) {
        const month = new Date(exp.date + "T12:00:00").getMonth() + 1;
        const ms = months[month];
        const catId = exp.category_id ?? "uncategorized";

        if (!ms.byCategory[catId]) {
          ms.byCategory[catId] = { amountCOP: 0, amountUSD: 0 };
        }

        const amountInBase = Number(exp.amount_in_base);
        const amountUSD = exp.currency !== "COP"
          ? Number(exp.amount)
          : amountInBase / 3700;

        ms.byCategory[catId].amountCOP += amountInBase;
        ms.byCategory[catId].amountUSD += amountUSD;

        ms.totalCOP += amountInBase;
        ms.totalUSD += amountUSD;
      }

      return { categories, months };
    },
  });
};
