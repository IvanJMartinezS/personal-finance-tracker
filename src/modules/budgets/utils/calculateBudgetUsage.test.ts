import { describe, expect, it } from 'vitest';
import { calculateBudgetUsage, getBudgetStatusColor } from './calculateBudgetUsage';

describe('calculateBudgetUsage', () => {
  it('calcula lo restante y el porcentaje usado cuando aún no se gasta nada', () => {
    expect(calculateBudgetUsage(200, 0)).toEqual({
      spentUSD: 0,
      remainingUSD: 200,
      percentUsed: 0,
      percentAvailable: 100,
    });
  });

  it('calcula lo restante y el porcentaje disponible con un gasto parcial', () => {
    const usage = calculateBudgetUsage(200, 50);
    expect(usage.remainingUSD).toBe(150);
    expect(usage.percentUsed).toBe(25);
    expect(usage.percentAvailable).toBe(75);
  });

  it('queda en 0 disponible cuando el gasto iguala exactamente el presupuesto', () => {
    const usage = calculateBudgetUsage(100, 100);
    expect(usage.remainingUSD).toBe(0);
    expect(usage.percentAvailable).toBe(0);
  });

  it('reporta disponible negativo cuando se supera el presupuesto', () => {
    const usage = calculateBudgetUsage(100, 150);
    expect(usage.remainingUSD).toBe(-50);
    expect(usage.percentUsed).toBe(150);
    expect(usage.percentAvailable).toBe(-50);
  });

  it('no divide por cero cuando el presupuesto es 0', () => {
    expect(calculateBudgetUsage(0, 0).percentAvailable).toBe(100);
    expect(calculateBudgetUsage(0, 10).percentAvailable).toBe(0);
  });
});

describe('getBudgetStatusColor', () => {
  it('es verde por encima del 50% disponible', () => {
    expect(getBudgetStatusColor(51)).toBe('green');
    expect(getBudgetStatusColor(100)).toBe('green');
  });

  it('es naranja entre 20% y 50% disponible (ambos extremos incluidos)', () => {
    expect(getBudgetStatusColor(50)).toBe('orange');
    expect(getBudgetStatusColor(35)).toBe('orange');
    expect(getBudgetStatusColor(20)).toBe('orange');
  });

  it('es rojo por debajo del 20% disponible, incluyendo presupuesto superado', () => {
    expect(getBudgetStatusColor(19)).toBe('red');
    expect(getBudgetStatusColor(0)).toBe('red');
    expect(getBudgetStatusColor(-50)).toBe('red');
  });
});
