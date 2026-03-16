import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const { t } = useTranslation();
const i18nString = (key: string) => ('schemas.expenses.' + key);

export const expenseSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  item: z.string().min(1, 'El concepto es requerido'),
  amount: z.number({
    required_error: 'El monto es requerido',
    invalid_type_error: 'El monto debe ser un número',
  }).positive('El monto debe ser positivo'),
  currency: z.string().min(1, 'La moneda es requerida'),
  exchange_rate: z.number({
    invalid_type_error: 'La tasa debe ser un número',
  }).optional(),
  notes: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.currency !== 'COP') {
    if (data.exchange_rate === undefined || data.exchange_rate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La tasa de cambio es requerida para moneda extranjera',
        path: ['exchange_rate'],
      });
    } else if (data.exchange_rate <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La tasa de cambio debe ser positiva',
        path: ['exchange_rate'],
      });
    }
  }
  else {
    if (data.exchange_rate !== undefined && data.exchange_rate <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La tasa de cambio debe ser positiva',
        path: ['exchange_rate'],
      });
    }
  }
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;