import { z } from 'zod';
import type { TFunction } from 'i18next';
import { transactionBaseFields, validateExchangeRate, makeI18nString } from './transactionSchema';

export const getExpenseSchema = (t: TFunction) => {
  const i18nString = makeI18nString(t, 'expenses');

  return z.object({
    ...transactionBaseFields(i18nString),
    item: z.string().min(1, i18nString('item.required')),
  }).superRefine(validateExchangeRate(i18nString));
};

export type ExpenseFormValues = z.infer<ReturnType<typeof getExpenseSchema>>;
