import { describe, expect, it } from 'vitest';
import { sumBudgetsUSD } from './sumBudgetsUSD';
import type { Budget } from '@/types';

const budget = (amount_usd: number): Budget => ({
  id: `b-${amount_usd}`,
  user_id: 'user-1',
  category_id: `c-${amount_usd}`,
  amount_usd,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  categories: null,
});

describe('sumBudgetsUSD', () => {
  it('suma el monto en USD de varios presupuestos', () => {
    expect(sumBudgetsUSD([budget(100), budget(50), budget(25)])).toBe(175);
  });

  it('devuelve 0 sin presupuestos', () => {
    expect(sumBudgetsUSD([])).toBe(0);
  });
});
