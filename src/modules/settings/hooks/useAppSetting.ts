import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lee un parámetro no sensible desde `app_settings` (ver
 * 008_create_app_settings.sql) — valores como URLs o textos que pueden
 * cambiarse por base de datos sin necesidad de un deploy.
 *
 * Usa `fallback` mientras carga, y también si la fila no existe todavía o si
 * la consulta falla: así un problema de red o un parámetro sin crear nunca
 * rompe la pantalla, solo hace que se use el valor de respaldo del código.
 */
export const useAppSetting = (name: string, fallback: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["app-setting", name],
    queryFn: async (): Promise<string | null> => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("name", name)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data?.value ?? null;
    },
    staleTime: 60 * 60 * 1000,
  });

  return { value: data ?? fallback, isLoading };
};
