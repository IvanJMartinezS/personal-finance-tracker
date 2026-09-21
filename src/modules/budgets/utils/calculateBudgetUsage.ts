export interface BudgetUsage {
  spentUSD: number;
  remainingUSD: number;
  /** 0-100+ — puede superar 100 si se gastó más de lo presupuestado. */
  percentUsed: number;
  /** 100 - percentUsed — puede ser negativo si se superó el presupuesto. */
  percentAvailable: number;
}

/**
 * Calcula cuánto de un presupuesto se ha usado dado lo gastado hasta ahora.
 * `amountUsd` es el monto presupuestado (siempre en USD, ver Budget); si es 0
 * se considera 0% disponible en cuanto haya cualquier gasto, y 100% si no hay
 * gasto aún (evita dividir por cero).
 */
export function calculateBudgetUsage(amountUsd: number, spentUSD: number): BudgetUsage {
  const remainingUSD = amountUsd - spentUSD;
  const percentUsed = amountUsd > 0 ? (spentUSD / amountUsd) * 100 : (spentUSD > 0 ? 100 : 0);
  const percentAvailable = 100 - percentUsed;
  return { spentUSD, remainingUSD, percentUsed, percentAvailable };
}

export type BudgetStatusColor = "green" | "orange" | "red";

/**
 * Umbrales pedidos: más del 50% disponible → verde; entre 20% y 50% → naranja;
 * menos del 20% (incluyendo presupuesto superado) → rojo.
 */
export function getBudgetStatusColor(percentAvailable: number): BudgetStatusColor {
  if (percentAvailable > 50) return "green";
  if (percentAvailable >= 20) return "orange";
  return "red";
}
