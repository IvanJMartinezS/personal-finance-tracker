import { supabase } from "@/integrations/supabase/client";
import type { CreateIncomeInput, Income } from "@/modules/incomes/utils/types";

export class IncomesService {

  /**
   * Obtiene ingresos con paginación opcional.
   * @param userId - ID del usuario 
   * @param limit - Número de registros por página (si no se provee, no aplica paginación)
   * @param page - Número de página (por defecto 1)
   */
  async getIncomes(userId?: string, limit?: number, page: number = 1): Promise<{ data: Income[], total: number, limit: number, page: number }> {

    let query =  supabase
      .from("incomes")
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
    if (error) throw new Error(`Error al obtener ingresos: ${error.message}`);

    return {
      data: data || [],
      total: count || 0,
      limit: limit || 0,
      page,
    };
  }

   /**
   * Crea un nuevo ingreso.
   * @param incomeData - Datos del ingreso (sin id, created_at, updated_at)
   */
  async createIncome(incomeData: CreateIncomeInput) {
    const { data, error } = await supabase
      .from("incomes")
      .insert(incomeData)
      .select()
      .single();
    if (error) {
      throw Object.assign(new Error(error.message), { code: error.code });
    }
    return data as Income;
  }


  /**
   * Actualiza un ingreso existente.
   * @param id - ID del ingreso
   * @param updates - Campos a actualizar
   */  
  async updateIncome(id: string, updates: Partial<Omit<Income, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from("incomes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Error al actualizar ingreso: ${error.message}`);
    return data as Income;
  }

   /**
   * Elimina un ingreso.
   * @param id - ID del ingreso
   */
  async deleteIncome(id: string): Promise<void> {
    const { error } = await supabase.from("incomes").delete().eq("id", id);
    if (error) throw new Error(`Error al eliminar ingreso: ${error.message}`);
  } 
}