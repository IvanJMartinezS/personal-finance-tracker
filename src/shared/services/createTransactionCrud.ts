import { supabase } from "@/integrations/supabase/client";

export interface PaginatedResult<TRow> {
  data: TRow[];
  total: number;
  limit: number;
  page: number;
}

/**
 * Fábrica de operaciones CRUD para tablas de "transacciones" (gastos e
 * ingresos), que comparten exactamente la misma forma de acceso a datos:
 * paginación opcional, join con `categories`, y create/update/delete simples.
 *
 * `ExpensesService` e `IncomesService` son wrappers finos sobre esto — solo
 * cambia el nombre de la tabla y los tipos. Evita mantener dos copias
 * idénticas de esta lógica (ver docs/PROJECT_OVERVIEW.md → duplicación).
 */
export function createTransactionCrud<TRow, TCreateInput extends object>(
  table: "expenses" | "incomes",
  entityLabel: string,
) {
  return {
    /**
     * Obtiene registros con paginación opcional.
     * @param userId - ID del usuario
     * @param limit - Número de registros por página (si no se provee, no aplica paginación)
     * @param page - Número de página (por defecto 1)
     */
    async getAll(userId?: string, limit?: number, page: number = 1): Promise<PaginatedResult<TRow>> {
      let query = supabase
        .from(table)
        .select("*, categories(name, color, type)", { count: "exact" })
        .order("date", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (limit && limit > 0) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(`Error al obtener ${entityLabel}: ${error.message}`);

      return {
        data: (data as TRow[]) ?? [],
        total: count ?? 0,
        limit: limit ?? 0,
        page,
      };
    },

    /** Crea un nuevo registro. */
    async create(input: TCreateInput): Promise<TRow> {
      // `table` es una unión ("expenses" | "incomes"), así que Supabase no puede
      // inferir un único shape de Insert para él; el cast se aísla aquí — la
      // firma pública de este método (`TCreateInput`) sigue siendo la que da
      // seguridad de tipos a quien llama.
      const { data, error } = await supabase.from(table).insert(input as never).select().single();
      if (error) {
        throw Object.assign(new Error(error.message), { code: error.code });
      }
      return data as TRow;
    },

    /** Actualiza un registro existente. */
    async update(id: string, updates: Partial<Omit<TRow, "id" | "created_at" | "updated_at">>): Promise<TRow> {
      const { data, error } = await supabase.from(table).update(updates as never).eq("id", id).select().single();
      if (error) throw new Error(`Error al actualizar ${entityLabel}: ${error.message}`);
      return data as TRow;
    },

    /** Elimina un registro. */
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(`Error al eliminar ${entityLabel}: ${error.message}`);
    },
  };
}
