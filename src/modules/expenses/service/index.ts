import { createTransactionCrud } from "@/shared/services/createTransactionCrud";
import type { CreateExpenseInput, Expense } from "@/modules/expenses/utils/types";

const crud = createTransactionCrud<Expense, CreateExpenseInput>("expenses", "gastos");

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
}
