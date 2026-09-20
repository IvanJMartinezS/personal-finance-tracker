import { beforeEach, describe, expect, it, vi } from 'vitest';

interface QueryResult {
  data: unknown;
  error: { message: string; code?: string } | null;
}

interface MockBuilder extends PromiseLike<QueryResult> {
  select: (...args: unknown[]) => MockBuilder;
  eq: (...args: unknown[]) => MockBuilder;
  insert: (...args: unknown[]) => MockBuilder;
  update: (...args: unknown[]) => MockBuilder;
  delete: (...args: unknown[]) => MockBuilder;
  single: () => Promise<QueryResult>;
}

// `vi.hoisted` porque `vi.mock` se eleva sobre los imports — el mock del
// cliente de Supabase necesita estas utilidades ya definidas en ese punto.
const { fromMock, setNextResult } = vi.hoisted(() => {
  let nextResult: QueryResult = { data: null, error: null };
  const setNextResult = (result: QueryResult) => { nextResult = result; };

  // Doble de prueba mínimo del query builder encadenable de Supabase: cada
  // método de encadenado devuelve el mismo builder, y el builder en sí es
  // "thenable" (se puede hacer `await` sobre él directamente), igual que el
  // builder real de supabase-js.
  const makeBuilder = (): MockBuilder => {
    const builder: MockBuilder = {
      select: () => builder,
      eq: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      single: () => Promise.resolve(nextResult),
      then: (onfulfilled, onrejected) => Promise.resolve(nextResult).then(onfulfilled, onrejected),
    };
    return builder;
  };

  const fromMock = vi.fn(() => makeBuilder());
  return { fromMock, setNextResult };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

// `vi.mock` se eleva automáticamente sobre este import, así que `BudgetsService`
// ya recibe el cliente de Supabase simulado de arriba.
import { BudgetsService } from './index';

describe('BudgetsService', () => {
  let service: InstanceType<typeof BudgetsService>;

  beforeEach(() => {
    service = new BudgetsService();
    fromMock.mockClear();
    setNextResult({ data: null, error: null });
  });

  it('getBudgets consulta la tabla budgets', async () => {
    setNextResult({ data: [{ id: 'b1' }], error: null });
    const result = await service.getBudgets('user-1');
    expect(fromMock).toHaveBeenCalledWith('budgets');
    expect(result).toEqual([{ id: 'b1' }]);
  });

  it('createBudget inserta en budgets y devuelve el registro creado', async () => {
    setNextResult({ data: { id: 'b1', amount_usd: 200 }, error: null });
    const result = await service.createBudget({ user_id: 'user-1', category_id: 'c1', amount_usd: 200 });
    expect(fromMock).toHaveBeenCalledWith('budgets');
    expect(result).toEqual({ id: 'b1', amount_usd: 200 });
  });

  it('createBudget conserva el código de error de Postgres al fallar', async () => {
    // Esto es lo que permite a CreateBudgetDialog distinguir "categoría
    // duplicada" (23505, ya existe un presupuesto para esa categoría) de
    // "categoría inválida" (22P02) y mostrar el mensaje correcto — si se
    // pierde el `.code` al envolver el error, esos mensajes dejarían de
    // funcionar sin que ningún tipo lo marque como error.
    setNextResult({ data: null, error: { message: 'duplicate key value violates unique constraint', code: '23505' } });
    await expect(
      service.createBudget({ user_id: 'user-1', category_id: 'c1', amount_usd: 200 })
    ).rejects.toMatchObject({ code: '23505', message: 'duplicate key value violates unique constraint' });
  });

  it('updateBudget actualiza por id y devuelve el registro actualizado', async () => {
    setNextResult({ data: { id: 'b1', amount_usd: 300 }, error: null });
    const result = await service.updateBudget('b1', { amount_usd: 300 });
    expect(fromMock).toHaveBeenCalledWith('budgets');
    expect(result).toEqual({ id: 'b1', amount_usd: 300 });
  });

  it('deleteBudget no lanza error cuando la operación es exitosa', async () => {
    await expect(service.deleteBudget('b1')).resolves.toBeUndefined();
    expect(fromMock).toHaveBeenCalledWith('budgets');
  });

  it('deleteBudget lanza un error legible cuando Supabase falla', async () => {
    setNextResult({ data: null, error: { message: 'network error' } });
    await expect(service.deleteBudget('b1')).rejects.toThrow(/network error/);
  });
});
