import { describe, expect, it } from 'vitest';
import { getElapsedMonthsInYear } from './dateUtils';

describe('getElapsedMonthsInYear', () => {
  it('devuelve el mes actual cuando el año consultado es el año en curso', () => {
    const reference = new Date('2026-09-19T12:00:00');
    expect(getElapsedMonthsInYear(2026, reference)).toBe(9);
  });

  it('devuelve 12 para un año anterior al actual (ya transcurrió por completo)', () => {
    // Esta es la regresión que motivó el bug original: antes, un `YEAR` fijo
    // dejaba de coincidir con el año real a partir de 2027 y el cálculo de
    // "mes actual" quedaba mal (ver docs/PROJECT_OVERVIEW.md).
    const reference = new Date('2027-03-10T12:00:00');
    expect(getElapsedMonthsInYear(2026, reference)).toBe(12);
  });

  it('devuelve 0 para un año futuro que todavía no ha comenzado', () => {
    const reference = new Date('2025-06-01T12:00:00');
    expect(getElapsedMonthsInYear(2026, reference)).toBe(0);
  });

  it('usa la fecha actual real cuando no se provee una fecha de referencia', () => {
    const now = new Date();
    expect(getElapsedMonthsInYear(now.getFullYear())).toBe(now.getMonth() + 1);
  });
});
