import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";
import type { Account } from "../utils/types";

export const useGetAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["accounts", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Account[]> => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("currency")
        .order("name");
      if (error) throw new Error(error.message);
      return data as Account[];
    },
  });
};
