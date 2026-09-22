import { z } from 'zod';
import type { TFunction } from 'i18next';

/**
 * Campos y validaciones compartidos por los formularios de gastos e ingresos
 * (ambos son, en esencia, el mismo concepto de "transacción" con un campo de
 * etiqueta distinto: `item` en gastos, `source` en ingresos).
 *
 * Se expone como funciones en vez de un `z.object` ya reutilizable para que
 * `getExpenseSchema`/`getIncomeSchema` sigan siendo objetos Zod concretos y
 * `z.infer` conserve el tipo exacto de cada uno (necesario para
 * `Control<ExpenseFormValues>` / `Control<IncomeFormValues>` en los forms).
 */
export const transactionBaseFields = (i18nString: (key: string) => string) => ({
  date: z.string().min(1, i18nString('date.required')),
  category_id: z.string().min(1, i18nString('category_id.required')),
  amount: z.number({
    required_error: i18nString('amount.required'),
    invalid_type_error: i18nString('amount.invalid_type'),
  }).positive(i18nString('amount.positive')),
  currency: z.string().min(1, i18nString('currency.required')),
  exchange_rate: z.number({
    invalid_type_error: i18nString('exchange_rate.invalid_type'),
  }).optional(),
  notes: z.string().optional().nullable(),
});

/**
 * Valida `exchange_rate`: siempre requerida y positiva, sin importar la
 * moneda — así cada gasto/ingreso queda con un equivalente exacto tanto en
 * USD (la moneda base) como en COP, en vez de depender de la tasa de
 * referencia estimada para las filas en USD que no dieran una tasa propia.
 */
export const validateExchangeRate = (
  i18nString: (key: string) => string,
) => (
  data: { currency: string; exchange_rate?: number | null },
  ctx: z.RefinementCtx,
) => {
  if (data.exchange_rate === undefined || data.exchange_rate === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nString('exchange_rate.required_for_foreign'),
      path: ['exchange_rate'],
    });
  } else if (data.exchange_rate <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nString('exchange_rate.positive'),
      path: ['exchange_rate'],
    });
  }
};

export const makeI18nString = (t: TFunction, namespace: 'expenses' | 'incomes') =>
  (key: string) => t(`schemas.${namespace}.${key}`);
