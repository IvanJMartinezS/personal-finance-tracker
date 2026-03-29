import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/shared/auth/useAuth";
import type { UpsertSnapshotInput } from "../utils/types";

export const useUpsertSnapshot = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpsertSnapshotInput) => {
      if (!user) throw new Error("Usuario no autenticado");
      const { error } = await supabase
        .from("account_snapshots")
        .upsert(
          { ...input, user_id: user.id },
          { onConflict: "account_id,year,month" }
        );
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-snapshots"] });
    },
  });
};
