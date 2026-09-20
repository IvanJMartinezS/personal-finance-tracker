import { z } from 'zod';
import type { TFunction } from 'i18next';
import { transactionBaseFields, validateExchangeRate, makeI18nString } from './transactionSchema';

export const getIncomeSchema = (t: TFunction) => {
  const i18nString = makeI18nString(t, 'incomes');

  return z.object({
    ...transactionBaseFields(i18nString),
    source: z.string().min(1, i18nString('source.required')),
  }).superRefine(validateExchangeRate(i18nString));
};

export type IncomeFormValues = z.infer<ReturnType<typeof getIncomeSchema>>;
