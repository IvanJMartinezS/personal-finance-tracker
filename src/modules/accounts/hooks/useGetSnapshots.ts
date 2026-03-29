import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";
import type { AccountSnapshot } from "../utils/types";

export const useGetSnapshots = (year: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["account-snapshots", user?.id, year],
    enabled: !!user,
    queryFn: async (): Promise<AccountSnapshot[]> => {
      const { data, error } = await supabase
        .from("account_snapshots")
        .select("*, account:accounts(id, name, currency, type, color)")
        .eq("user_id", user!.id)
        .eq("year", year)
        .order("month");
      if (error) throw new Error(error.message);
      return data as unknown as AccountSnapshot[];
    },
  });
};
