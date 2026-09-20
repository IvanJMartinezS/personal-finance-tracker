import type { Budget, Category } from "@/types";

/**
 * Categorías de gasto para las que todavía no existe un presupuesto — son las
 * únicas que tiene sentido ofrecer al crear un presupuesto nuevo. La
 * restricción UNIQUE(user_id, category_id) en la base de datos (ver
 * 005_create_budgets.sql) impide crear un segundo presupuesto para una
 * categoría ya presupuestada; para cambiar su monto se usa "editar" en el
 * listado en vez de crear uno nuevo.
 */
export function getAvailableCategoriesForBudget(categories: Category[], budgets: Budget[]): Category[] {
  const budgetedCategoryIds = new Set(budgets.map((b) => b.category_id));
  return categories.filter((c) => !budgetedCategoryIds.has(c.id));
}
