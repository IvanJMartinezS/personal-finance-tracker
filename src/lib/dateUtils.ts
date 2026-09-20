// Utilidades de fecha compartidas por los reportes anuales (resumen, cuentas).

/**
 * Año de referencia usado por defecto en los reportes anuales (resumen y
 * cuentas) mientras no exista un selector de año en la interfaz.
 *
 * TODO(fase-2): reemplazar por el año que el usuario seleccione en un filtro,
 * en vez de un valor fijo. Centralizar esta constante aquí permite que ese
 * cambio se haga en un solo lugar en vez de en cada página que la usaba.
 */
export const DEFAULT_YEAR = 2026;

/**
 * Calcula cuántos meses de `year` ya transcurrieron respecto a `referenceDate`.
 * - Años anteriores al actual: los 12 meses ya transcurrieron.
 * - Año actual: el mes actual (1-12).
 * - Años futuros: 0 (el año todavía no ha comenzado).
 */
export function getElapsedMonthsInYear(year: number, referenceDate: Date = new Date()): number {
  const currentYear = referenceDate.getFullYear();
  if (year < currentYear) return 12;
  if (year > currentYear) return 0;
  return referenceDate.getMonth() + 1;
}
