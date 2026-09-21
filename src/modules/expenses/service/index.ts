import { createTransactionCrud } from "@/shared/services/createTransactionCrud";
import { supabase } from "@/integrations/supabase/client";
import { toUsdEquivalent } from "@/lib/mock-data";
import type { CreateExpenseInput, Expense } from "@/modules/expenses/utils/types";

const crud = createTransactionCrud<Expense, CreateExpenseInput>("expenses", "gastos");

/** Primer y último día de `year`-`month`, en formato `YYYY-MM-DD`. */
function monthDateRange(year: number, month: number): { from: string; to: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate(); // día 0 del mes siguiente = último día de este mes
  const to = `${year}-${pad(month)}-${pad(lastDay)}`;
  return { from, to };
}

export class ExpensesService {
  /**
   * Obtiene gastos con paginación opcional.
   * @param userId - ID del usuario
   * @param limit - Número de registros por página (si no se provee, no aplica paginación)
   * @param page - Número de página (por defecto 1)
   */
  getExpenses = crud.getAll;

  /**
   * Crea un nuevo gasto.
   * @param expenseData - Datos del gasto (sin id, created_at, updated_at)
   */
  createExpense = crud.create;

  /**
   * Actualiza un gasto existente.
   * @param id - ID del gasto
   * @param updates - Campos a actualizar
   */
  updateExpense = crud.update;

  /**
   * Elimina un gasto.
   * @param id - ID del gasto
   */
  deleteExpense = crud.remove;

  /**
   * Suma, en USD, lo gastado en `year`-`month` por categoría — usado por el
   * presupuesto (widget del dashboard y aviso al guardar un gasto) para saber
   * cuánto se ha consumido de cada categoría presupuestada ese mes.
   * @returns un mapa `category_id → total en USD` (categorías sin gasto ese mes no aparecen)
   */
  async getMonthCategoryTotalsUSD(userId: string, year: number, month: number): Promise<Record<string, number>> {
    const { from, to } = monthDateRange(year, month);
    const { data, error } = await supabase
      .from("expenses")
      .select("category_id, amount, amount_in_base, currency")
      .eq("user_id", userId)
      .gte("date", from)
      .lte("date", to);

    if (error) throw new Error(`Error al calcular gastos del mes: ${error.message}`);

    const totals: Record<string, number> = {};
    for (const exp of data ?? []) {
      if (!exp.category_id) continue;
      totals[exp.category_id] = (totals[exp.category_id] ?? 0) + toUsdEquivalent(exp);
    }
    return totals;
  }
}
