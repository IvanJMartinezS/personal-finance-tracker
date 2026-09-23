import { describe, expect, it } from 'vitest';
import { calculateExpenseBudgetOverages } from './calculateExpenseBudgetOverages';
import type { Budget, Expense } from '@/types';

const budget = (amount_usd: number, createdAt = '2026-01-01T00:00:00Z'): Budget => ({
  id: 'b1',
  user_id: 'user-1',
  category_id: 'c1',
  amount_usd,
  created_at: createdAt,
  updated_at: createdAt,
  categories: { id: 'c1', name: 'Mercado', type: 'expense', color: '#000' },
});

const expense = (overrides: Partial<Expense> & { id: string; amount_in_base: number; date: string }): Expense => ({
  user_id: 'user-1',
  category_id: 'c1',
  item: 'Item',
  amount: overrides.amount_in_base,
  currency: 'USD',
  exchange_rate: 1,
  notes: null,
  created_at: `${overrides.date}T12:00:00Z`,
  updated_at: `${overrides.date}T12:00:00Z`,
  categories: null,
  ...overrides,
});

describe('calculateExpenseBudgetOverages', () => {
  it('reproduce el ejemplo: presupuesto de $80 ya con eso disponible, gasto de $100 excede por $20', () => {
    // "Quedaban $80" → interpretado como presupuesto de $80 (primer gasto del mes)
    const budgets = [budget(80)];
    const expenses = [expense({ id: 'e1', amount_in_base: 100, date: '2026-09-05' })];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);

    expect(overages.get('e1')).toEqual({ excessUSD: 20, cumulativeExcessUSD: 20 });
  });

  it('un segundo gasto después de superado el presupuesto es 100% excedente, y el acumulado suma', () => {
    const budgets = [budget(80)];
    const expenses = [
      expense({ id: 'e1', amount_in_base: 100, date: '2026-09-05' }),
      expense({ id: 'e2', amount_in_base: 40, date: '2026-09-10' }),
    ];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);

    expect(overages.get('e1')).toEqual({ excessUSD: 20, cumulativeExcessUSD: 20 });
    // El segundo gasto completo es excedente (ya no quedaba presupuesto), y el
    // acumulado de la categoría ese mes queda en 20 + 40 = 60.
    expect(overages.get('e2')).toEqual({ excessUSD: 40, cumulativeExcessUSD: 60 });
  });

  it('un gasto que no llega a superar el presupuesto no aparece en el resultado', () => {
    const budgets = [budget(100)];
    const expenses = [expense({ id: 'e1', amount_in_base: 50, date: '2026-09-05' })];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);

    expect(overages.has('e1')).toBe(false);
  });

  it('un gasto que cruza el límite exacto solo reporta la porción que sobra', () => {
    const budgets = [budget(100)];
    const expenses = [expense({ id: 'e1', amount_in_base: 70, date: '2026-09-05' })];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);
    expect(overages.has('e1')).toBe(false);

    const expenses2 = [
      expense({ id: 'e1', amount_in_base: 70, date: '2026-09-05' }),
      expense({ id: 'e2', amount_in_base: 50, date: '2026-09-06' }), // 70+50=120, excede por 20
    ];
    const overages2 = calculateExpenseBudgetOverages(expenses2, budgets);
    expect(overages2.has('e1')).toBe(false);
    expect(overages2.get('e2')).toEqual({ excessUSD: 20, cumulativeExcessUSD: 20 });
  });

  it('ignora gastos sin categoría o de una categoría sin presupuesto', () => {
    const budgets = [budget(10)];
    const expenses = [
      expense({ id: 'e1', amount_in_base: 999, date: '2026-09-05', category_id: null }),
      expense({ id: 'e2', amount_in_base: 999, date: '2026-09-05', category_id: 'c2' }),
    ];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);
    expect(overages.size).toBe(0);
  });

  it('no marca gastos de un mes anterior a que el presupuesto existiera', () => {
    const budgets = [budget(10, '2026-09-15T00:00:00Z')]; // creado en septiembre
    const expenses = [expense({ id: 'e1', amount_in_base: 999, date: '2026-08-01' })]; // agosto, antes de crearse

    const overages = calculateExpenseBudgetOverages(expenses, budgets);
    expect(overages.has('e1')).toBe(false);
  });

  it('trata meses y categorías distintas de forma independiente (no se mezclan)', () => {
    const budgets = [budget(50)];
    const expenses = [
      expense({ id: 'e1', amount_in_base: 60, date: '2026-08-05' }), // agosto: excede por 10
      expense({ id: 'e2', amount_in_base: 60, date: '2026-09-05' }), // septiembre: excede por 10, no arrastra de agosto
    ];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);
    expect(overages.get('e1')).toEqual({ excessUSD: 10, cumulativeExcessUSD: 10 });
    expect(overages.get('e2')).toEqual({ excessUSD: 10, cumulativeExcessUSD: 10 });
  });

  it('ordena por fecha y no por el orden en que se pasan los gastos', () => {
    const budgets = [budget(80)];
    // Pasados en orden inverso al cronológico — debe seguir dando el mismo resultado.
    const expenses = [
      expense({ id: 'e2', amount_in_base: 40, date: '2026-09-10' }),
      expense({ id: 'e1', amount_in_base: 100, date: '2026-09-05' }),
    ];

    const overages = calculateExpenseBudgetOverages(expenses, budgets);
    expect(overages.get('e1')).toEqual({ excessUSD: 20, cumulativeExcessUSD: 20 });
    expect(overages.get('e2')).toEqual({ excessUSD: 40, cumulativeExcessUSD: 60 });
  });
});
