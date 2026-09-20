import { supabase } from "@/integrations/supabase/client";
import type { Budget, CreateBudgetInput } from "@/modules/budgets/utils/types";

export class BudgetsService {

  /**
   * Obtiene los presupuestos del usuario, con su categoría asociada.
   * @param userId - ID del usuario
   */
  async getBudgets(userId?: string): Promise<Budget[]> {
    let query = supabase
      .from("budgets")
      .select("*, categories(name, color, type)");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error al obtener presupuestos: ${error.message}`);
    return (data as Budget[]) ?? [];
  }

  /**
   * Crea un nuevo presupuesto para una categoría.
   * @param budgetData - Datos del presupuesto (sin id, created_at, updated_at)
   */
  async createBudget(budgetData: CreateBudgetInput): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .insert(budgetData)
      .select()
      .single();
    if (error) {
      throw Object.assign(new Error(error.message), { code: error.code });
    }
    return data as Budget;
  }

  /**
   * Actualiza un presupuesto existente.
   * @param id - ID del presupuesto
   * @param updates - Campos a actualizar
   */
  async updateBudget(id: string, updates: Partial<Omit<Budget, "id" | "user_id" | "created_at" | "updated_at" | "categories">>): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw Object.assign(new Error(error.message), { code: error.code });
    }
    return data as Budget;
  }

  /**
   * Elimina un presupuesto.
   * @param id - ID del presupuesto
   */
  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw new Error(`Error al eliminar presupuesto: ${error.message}`);
  }
}
