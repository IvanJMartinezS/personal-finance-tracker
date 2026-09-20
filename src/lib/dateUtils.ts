// Utilidades de fecha compartidas por los reportes anuales (resumen, cuentas).

/**
 * Primer año con datos en la app. Define el límite inferior del selector de
 * año en los reportes anuales (resumen y cuentas).
 */
export const MIN_YEAR = 2026;

/**
 * Año seleccionado por defecto al entrar a un reporte anual: el año en curso,
 * salvo que sea anterior a `MIN_YEAR` (en cuyo caso no habría datos aún).
 */
export function getDefaultYear(referenceDate: Date = new Date()): number {
  return Math.max(referenceDate.getFullYear(), MIN_YEAR);
}

/**
 * Años que se pueden elegir en el selector: desde `MIN_YEAR` hasta el año en
 * curso (no tiene sentido ofrecer años futuros, todavía sin datos).
 */
export function getSelectableYears(referenceDate: Date = new Date()): number[] {
  const lastYear = getDefaultYear(referenceDate);
  const years: number[] = [];
  for (let y = MIN_YEAR; y <= lastYear; y++) years.push(y);
  return years;
}

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
