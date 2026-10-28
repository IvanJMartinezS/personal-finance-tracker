import { supabase } from "@/integrations/supabase/client";
import type { Budget, BudgetMonthlyAmount, CreateBudgetInput } from "@/modules/budgets/utils/types";

export class BudgetsService {

  /**
   * Obtiene los presupuestos del usuario, con su categoría asociada.
   * @param userId - ID del usuario
   */
  async getBudgets(userId?: string): Promise<Budget[]> {
    let query = supabase
      .from("budgets")
      .select("*, categories(name, color, type), budget_monthly_amounts(year, month, amount_usd)");

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

  /**
   * Guarda (inserta o actualiza) uno o más ajustes mensuales del monto de un
   * presupuesto — ver 009_create_budget_monthly_amounts.sql y
   * `buildBudgetAmountUpdates`. `onConflict` apunta al UNIQUE(budget_id,
   * year, month): si ya existe una fila para ese mes, se actualiza en vez de
   * duplicarla.
   */
  async upsertMonthlyAmounts(budgetId: string, userId: string, rows: BudgetMonthlyAmount[]): Promise<void> {
    if (rows.length === 0) return;
    const { error } = await supabase
      .from("budget_monthly_amounts")
      .upsert(
        rows.map((r) => ({ budget_id: budgetId, user_id: userId, year: r.year, month: r.month, amount_usd: r.amount_usd })),
        { onConflict: "budget_id,year,month" }
      );
    if (error) throw new Error(`Error al guardar el historial del presupuesto: ${error.message}`);
  }

  /**
   * Obtiene el presupuesto de una categoría puntual, o `null` si no tiene uno
   * asignado. Usado al guardar un gasto, para saber si hay que avisar cuánto
   * queda disponible de esa categoría.
   */
  async getBudgetForCategory(userId: string, categoryId: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from("budgets")
      .select("*, categories(name, color, type), budget_monthly_amounts(year, month, amount_usd)")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .maybeSingle();

    if (error) throw new Error(`Error al obtener presupuesto de la categoría: ${error.message}`);
    return data as Budget | null;
  }
}
