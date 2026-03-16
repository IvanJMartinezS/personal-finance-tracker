import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Filter } from "@/shared/components/ui/Filter";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { CURRENCIES } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import type { Category, Currency } from "../utils/types"; 
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormValues } from '@/schemas/expenseSchema';
import { useCreateExpense } from "../hooks/useGetCreateExpense";

interface CreateExpenseDialogProps {
  categories: Category[];
}

export const CreateExpenseDialog = ({ categories }: CreateExpenseDialogProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);
  const createExpense = useCreateExpense();

  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      item: '',
      amount: undefined,
      currency: 'COP',
      exchange_rate: undefined,
      notes: '',
    },
  });

  const watchCurrency = useWatch({ control, name: "currency" });

  const onSubmit = (data: ExpenseFormValues) => {
    const amount_in_base = data.amount * (data.exchange_rate || 1);
    createExpense.mutate(
      { 
        ...data, 
        amount_in_base, 
        notes: data.notes || null,
        exchange_rate: data.currency === 'COP' ? 1 : data.exchange_rate,
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {i18nString('newExpense')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString('registerExpense')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
      
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">{i18nString('date')}</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input id="date" type="date" {...field} />
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">{i18nString('category')}</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Filter
                    value={field.value}
                    onValueChange={field.onChange}
                    items={categories}
                    firstValue={categories.length > 0 ? categories[0].name : 'all'}
                    placeholder={i18nString('selectCategory')}
                    getKey={(c: Category) => c.id}
                    getValue={(c: Category) => c.id}
                    renderLabel={(c: Category) => (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    )}
                  />
                )}
              />
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item">{i18nString('item')}</Label>
            <Controller
              name="item"
              control={control}
              render={({ field }) => (
                <Input id="item" {...field} placeholder={i18nString('exampleItem')} />
              )}
            />
            {errors.item && (
              <p className="text-sm text-destructive">{errors.item.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">{i18nString('amount')}</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    className="no-spinner"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : e.target.valueAsNumber);
                    }}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency">{i18nString('currency')}</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Filter
                    value={field.value}
                    onValueChange={field.onChange}
                    items={CURRENCIES}
                    getKey={(c: Currency) => c.code}
                    getValue={(c: Currency) => c.code}
                    renderLabel={(c: Currency) => <>{c.code} - {c.symbol}</>}
                  />
                )}
              />
            </div>
          </div>

          {watchCurrency !== "COP" && (
            <div className="space-y-1.5">
              <Label htmlFor="exchange_rate">{i18nString('exchangeRate')}</Label>
              <Controller
                name="exchange_rate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="exchange_rate"
                    type="number"
                    placeholder={i18nString('exampleItemExchange')}
                    className="no-spinner"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : e.target.valueAsNumber);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') e.preventDefault();
                    }}
                  />
                )}
              />
              {errors.exchange_rate && (
                <p className="text-sm text-destructive">{errors.exchange_rate.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="notes">{i18nString('notes')}</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder={i18nString('descriptionNote')}
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? i18nString('saving') : i18nString('save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};