import { createTransactionCrud } from "@/shared/services/createTransactionCrud";
import type { CreateIncomeInput, Income } from "@/modules/incomes/utils/types";

const crud = createTransactionCrud<Income, CreateIncomeInput>("incomes", "ingresos");

export class IncomesService {
  /**
   * Obtiene ingresos con paginación opcional.
   * @param userId - ID del usuario
   * @param limit - Número de registros por página (si no se provee, no aplica paginación)
   * @param page - Número de página (por defecto 1)
   */
  getIncomes = crud.getAll;

  /**
   * Crea un nuevo ingreso.
   * @param incomeData - Datos del ingreso (sin id, created_at, updated_at)
   */
  createIncome = crud.create;

  /**
   * Actualiza un ingreso existente.
   * @param id - ID del ingreso
   * @param updates - Campos a actualizar
   */
  updateIncome = crud.update;

  /**
   * Elimina un ingreso.
   * @param id - ID del ingreso
   */
  deleteIncome = crud.remove;
}
