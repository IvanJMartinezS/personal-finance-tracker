import { describe, expect, it } from 'vitest';
import { getDefaultYear, getElapsedMonthsInYear, getSelectableYears, MIN_YEAR } from './dateUtils';

describe('getDefaultYear', () => {
  it('devuelve el año en curso cuando ya hay datos disponibles', () => {
    expect(getDefaultYear(new Date('2027-03-10T12:00:00'))).toBe(2027);
  });

  it('no baja de MIN_YEAR aunque el reloj marque un año anterior', () => {
    expect(getDefaultYear(new Date('2024-01-01T12:00:00'))).toBe(MIN_YEAR);
  });
});

describe('getSelectableYears', () => {
  it('va desde MIN_YEAR hasta el año en curso, incluyendo ambos extremos', () => {
    expect(getSelectableYears(new Date('2028-05-01T12:00:00'))).toEqual([2026, 2027, 2028]);
  });

  it('solo ofrece MIN_YEAR cuando el año en curso es anterior a MIN_YEAR', () => {
    expect(getSelectableYears(new Date('2024-01-01T12:00:00'))).toEqual([MIN_YEAR]);
  });
});

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
