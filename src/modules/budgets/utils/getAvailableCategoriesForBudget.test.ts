import { describe, expect, it } from 'vitest';
import { getAvailableCategoriesForBudget } from './getAvailableCategoriesForBudget';
import type { Budget, Category } from '@/types';

const category = (id: string, name: string): Category => ({
  id,
  name,
  type: 'expense',
  color: '#000000',
});

const budgetFor = (categoryId: string): Budget => ({
  id: `budget-${categoryId}`,
  user_id: 'user-1',
  category_id: categoryId,
  amount_usd: 100,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  categories: null,
});

describe('getAvailableCategoriesForBudget', () => {
  it('devuelve todas las categorías cuando ninguna tiene presupuesto', () => {
    const categories = [category('c1', 'Alimentación'), category('c2', 'Transporte')];
    expect(getAvailableCategoriesForBudget(categories, [])).toEqual(categories);
  });

  it('excluye una categoría que ya tiene presupuesto asignado', () => {
    // Este es el caso que protege que, al crear un presupuesto, no se pueda
    // elegir una categoría ya presupuestada (chocaría con la restricción
    // UNIQUE(user_id, category_id) de la base de datos).
    const alimentacion = category('c1', 'Alimentación');
    const transporte = category('c2', 'Transporte');
    const result = getAvailableCategoriesForBudget([alimentacion, transporte], [budgetFor('c1')]);
    expect(result).toEqual([transporte]);
  });

  it('devuelve una lista vacía cuando todas las categorías ya tienen presupuesto', () => {
    const categories = [category('c1', 'Alimentación'), category('c2', 'Transporte')];
    const budgets = [budgetFor('c1'), budgetFor('c2')];
    expect(getAvailableCategoriesForBudget(categories, budgets)).toEqual([]);
  });

  it('ignora presupuestos de categorías que ya no están en la lista (p. ej. de otro tipo)', () => {
    const transporte = category('c2', 'Transporte');
    const result = getAvailableCategoriesForBudget([transporte], [budgetFor('c1')]);
    expect(result).toEqual([transporte]);
  });
});
