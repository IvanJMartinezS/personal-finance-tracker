import { supabase } from "@/integrations/supabase/client";
import type { CreateExpenseInput, Expense } from "@/modules/expenses/utils/types";

export class ExpensesService {

  /**
   * Obtiene gastos con paginación opcional.
   * @param userId - ID del usuario 
   * @param limit - Número de registros por página (si no se provee, no aplica paginación)
   * @param page - Número de página (por defecto 1)
   */
  async getExpenses(userId?: string, limit?: number, page: number = 1): Promise<{ data: Expense[], total: number, limit: number, page: number }> {

    let query =  supabase
      .from("expenses")
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
    if (error) throw new Error(`Error al obtener gastos: ${error.message}`);

    return {
      data: data as Expense[] || [],
      total: count || 0,
      limit: limit || 0,
      page,
    };
  }

   /**
   * Crea un nuevo gasto.
   * @param expenseData - Datos del gasto (sin id, created_at, updated_at)
   */
  async createExpense(expenseData: CreateExpenseInput) {
    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseData)
      .select()
      .single();
    if (error) {
      throw Object.assign(new Error(error.message), { code: error.code });
    }
    return data as Expense;
  }


  /**
   * Actualiza un gasto existente.
   * @param id - ID del gasto
   * @param updates - Campos a actualizar
   */  async updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Error al actualizar gasto: ${error.message}`);
    return data as Expense;
  }

   /**
   * Elimina un gasto.
   * @param id - ID del gasto
   */
  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw new Error(`Error al eliminar gasto: ${error.message}`);
  } 
}