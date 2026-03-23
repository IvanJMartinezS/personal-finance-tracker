import { z } from 'zod';
import type { TFunction } from 'i18next';

export const getIncomeSchema = (t: TFunction) => {
  const i18nString = (key: string) => t(`schemas.incomes.${key}`);

  return z.object({
    date: z.string().min(1, i18nString('date.required')),
    category_id: z.string().min(1, i18nString('category_id.required')),
    source: z.string().min(1, i18nString('source.required')),
    amount: z.number({
      required_error: i18nString('amount.required'),
      invalid_type_error: i18nString('amount.invalid_type'),
    }).positive(i18nString('amount.positive')),
    currency: z.string().min(1, i18nString('currency.required')),
    exchange_rate: z.number({
      invalid_type_error: i18nString('exchange_rate.invalid_type'),
    }).optional(),
    notes: z.string().optional().nullable(),
  }).superRefine((data, ctx) => {
    if (data.currency !== 'COP') {
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
    }
  });
};

export type IncomeFormValues = z.infer<ReturnType<typeof getIncomeSchema>>;
