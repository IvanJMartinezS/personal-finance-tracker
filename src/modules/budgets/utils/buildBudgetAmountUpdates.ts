import type { Budget, BudgetMonthlyAmount } from "@/types";

/**
 * Calcula qué filas hay que guardar en `budget_monthly_amounts` al editar el
 * monto de un presupuesto, para que el ajuste rija desde el mes actual en
 * adelante SIN reescribir los meses que ya pasaron (ver
 * 009_create_budget_monthly_amounts.sql y `resolveBudgetAmountForMonth`).
 *
 * Si el presupuesto NUNCA se había editado (sin entradas todavía), hay que
 * guardar DOS filas, no una: el monto ORIGINAL anclado al mes de creación
 * (para que los meses entre la creación y esta edición sigan resolviendo al
 * monto viejo), y el monto NUEVO desde el mes actual. Si ya tenía entradas
 * previas, alcanza con la del mes actual — el historial de antes ya está
 * cubierto por ajustes anteriores.
 *
 * Si la creación y la edición caen en el mismo mes, no hace falta anclar el
 * original por separado (no hay ningún mes previo que proteger) — la fila
 * del mes actual con el monto nuevo alcanza.
 */
export function buildBudgetAmountUpdates(
  budget: Pick<Budget, "created_at" | "amount_usd" | "budget_monthly_amounts">,
  newAmountUsd: number,
  now: Date,
): BudgetMonthlyAmount[] {
  const updates: BudgetMonthlyAmount[] = [];
  const hasAnyEntry = (budget.budget_monthly_amounts?.length ?? 0) > 0;
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  if (!hasAnyEntry) {
    const created = new Date(budget.created_at);
    const createdYear = created.getFullYear();
    const createdMonth = created.getMonth() + 1;
    const isSameMonthAsCreation = createdYear === nowYear && createdMonth === nowMonth;

    if (!isSameMonthAsCreation) {
      updates.push({ year: createdYear, month: createdMonth, amount_usd: budget.amount_usd });
    }
  }

  updates.push({ year: nowYear, month: nowMonth, amount_usd: newAmountUsd });

  return updates;
}
