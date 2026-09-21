import { describe, expect, it } from 'vitest';
import { calculateBudgetHistory } from './calculateBudgetHistory';
import type { Budget } from '@/types';

const mercadoBudget = (amount_usd: number, createdAt = '2026-01-01T00:00:00Z'): Budget => ({
  id: 'b1',
  user_id: 'user-1',
  category_id: 'c1',
  amount_usd,
  created_at: createdAt,
  updated_at: createdAt,
  categories: { id: 'c1', name: 'Mercado', type: 'expense', color: '#000' },
});

describe('calculateBudgetHistory', () => {
  it('reproduce el ejemplo: presupuesto de 30, gastando 20/15/25 deja 10/15/5 disponible y acumula 10/25/30', () => {
    const budgets = [mercadoBudget(30)];
    const monthlySpentByCategory = {
      1: { c1: 20 },
      2: { c1: 15 },
      3: { c1: 25 },
    };

    const [history] = calculateBudgetHistory(budgets, monthlySpentByCategory, 2026, 3);
    const [m1, m2, m3] = history.entries;

    expect(m1).toMatchObject({ month: 1, remainingUSD: 10, accumulatedUSD: 10 });
    expect(m2).toMatchObject({ month: 2, remainingUSD: 15, accumulatedUSD: 25 });
    expect(m3).toMatchObject({ month: 3, remainingUSD: 5, accumulatedUSD: 30 });
  });

  it('trata un mes sin gastos como "gastado 0" (sobrante = presupuesto completo)', () => {
    const budgets = [mercadoBudget(100)];
    const [history] = calculateBudgetHistory(budgets, {}, 2026, 2);
    expect(history.entries).toEqual([
      { month: 1, spentUSD: 0, remainingUSD: 100, accumulatedUSD: 100 },
      { month: 2, spentUSD: 0, remainingUSD: 100, accumulatedUSD: 200 },
    ]);
  });

  it('resta del acumulado cuando un mes se supera el presupuesto', () => {
    const budgets = [mercadoBudget(50)];
    const monthlySpentByCategory = { 1: { c1: 30 }, 2: { c1: 80 } };
    const [history] = calculateBudgetHistory(budgets, monthlySpentByCategory, 2026, 2);
    expect(history.entries[0]).toMatchObject({ remainingUSD: 20, accumulatedUSD: 20 });
    expect(history.entries[1]).toMatchObject({ remainingUSD: -30, accumulatedUSD: -10 });
  });

  it('genera una entrada por cada presupuesto, sin mezclar categorías', () => {
    const otro: Budget = { ...mercadoBudget(40), id: 'b2', category_id: 'c2', categories: { id: 'c2', name: 'Transporte', type: 'expense', color: '#111' } };
    const monthlySpentByCategory = { 1: { c1: 10, c2: 5 } };
    const result = calculateBudgetHistory([mercadoBudget(30), otro], monthlySpentByCategory, 2026, 1);

    expect(result).toHaveLength(2);
    expect(result[0].entries[0].remainingUSD).toBe(20); // 30 - 10
    expect(result[1].entries[0].remainingUSD).toBe(35); // 40 - 5
  });

  it('devuelve una lista vacía de entradas cuando aún no ha transcurrido ningún mes', () => {
    const [history] = calculateBudgetHistory([mercadoBudget(100)], {}, 2026, 0);
    expect(history.entries).toEqual([]);
  });

  it('arranca el historial en el mes en que se creó el presupuesto, no en enero', () => {
    // Presupuesto creado el 15 de septiembre de 2026 — no debe haber entradas
    // para enero-agosto, aunque el año tenga meses transcurridos antes.
    const budget = mercadoBudget(100, '2026-09-15T00:00:00Z');
    const monthlySpentByCategory = { 8: { c1: 999 }, 9: { c1: 20 } };
    const [history] = calculateBudgetHistory([budget], monthlySpentByCategory, 2026, 10);

    expect(history.entries.map((e) => e.month)).toEqual([9, 10]);
    expect(history.entries[0]).toMatchObject({ month: 9, remainingUSD: 80, accumulatedUSD: 80 });
  });

  it('aplica el presupuesto desde enero cuando se creó en un año anterior al consultado', () => {
    const budget = mercadoBudget(50, '2025-11-01T00:00:00Z');
    const [history] = calculateBudgetHistory([budget], {}, 2026, 2);
    expect(history.entries.map((e) => e.month)).toEqual([1, 2]);
  });

  it('no genera entradas para un año anterior a cuando se creó el presupuesto', () => {
    const budget = mercadoBudget(50, '2026-03-01T00:00:00Z');
    const [history] = calculateBudgetHistory([budget], {}, 2025, 12);
    expect(history.entries).toEqual([]);
  });
});
