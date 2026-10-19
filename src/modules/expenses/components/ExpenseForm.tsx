// src/modules/expenses/components/ExpenseForm.tsx
import { useWatch } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { SELECTABLE_CURRENCIES, formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { FormField } from "@/shared/components/FormField";
import { numericInputValue, parseNumericInput } from "@/shared/components/numericField";
import { useBudgetsUsage } from "@/modules/budgets/hooks/useBudgetsUsage";
import type { Control, FieldErrors } from "react-hook-form";
import type { ExpenseFormValues } from "@/schemas/expenseSchema";
import type { Category } from "../utils/types";

interface ExpenseFormProps {
  control: Control<ExpenseFormValues>;
  errors: FieldErrors<ExpenseFormValues>;
  categories: Category[];
  i18nString: (key: string, options?: Record<string, unknown>) => string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/** Disponible del presupuesto de la categoría seleccionada, para el mes de la
 * fecha elegida — así el usuario no registra el gasto "a ciegas" sin saber
 * cuánto le queda. No se muestra nada si la categoría no tiene presupuesto. */
const CategoryBudgetHint = ({
  control,
  i18nString,
}: {
  control: Control<ExpenseFormValues>;
  i18nString: (key: string, options?: Record<string, unknown>) => string;
}) => {
  const categoryId = useWatch({ control, name: "category_id" });
  const date = useWatch({ control, name: "date" });
  const [year, month] = (date || new Date().toISOString().slice(0, 10)).split("-").map(Number);
  const { data: budgetsUsage } = useBudgetsUsage(year, month);

  const usage = budgetsUsage.find((b) => b.budget.category_id === categoryId);
  if (!usage) return null;

  const isExceeded = usage.remainingUSD < 0;
  return (
    <p className={cn("text-xs mt-1", isExceeded ? "text-destructive" : "text-muted-foreground")}>
      {isExceeded
        ? i18nString("categoryBudgetExceeded", { amount: formatCurrency(Math.abs(usage.remainingUSD), "USD") })
        : i18nString("categoryBudgetAvailable", { amount: formatCurrency(usage.remainingUSD, "USD") })}
    </p>
  );
};

export const ExpenseForm = ({
  control,
  errors,
  categories,
  i18nString,
  isSubmitting,
  onSubmit,
}: ExpenseFormProps) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          name="date"
          label={i18nString("date")}
          control={control}
          errors={errors}
        >
          {(field) => <Input type="date" {...field} />}
        </FormField>

        <div>
          <FormField
            name="category_id"
            label={i18nString("category")}
            control={control}
            errors={errors}
          >
            {(field) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={i18nString("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: Category) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <CategoryBudgetHint control={control} i18nString={i18nString} />
        </div>
      </div>

      <FormField
        name="item"
        label={i18nString("item")}
        control={control}
        errors={errors}
      >
        {(field) => (
          <Input {...field} placeholder={i18nString("exampleItem")} />
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          name="amount"
          label={i18nString("amount")}
          control={control}
          errors={errors}
        >
          {(field) => (
            <Input
              type="number"
              placeholder="0"
              className="no-spinner"
              {...field}
              value={numericInputValue(field.value)}
              onChange={(e) => field.onChange(parseNumericInput(e))}
            />
          )}
        </FormField>

        <FormField
          name="currency"
          label={i18nString("currency")}
          control={control}
          errors={errors}
        >
          {(field) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SELECTABLE_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormField
        name="exchange_rate"
        label={i18nString("exchangeRate")}
        control={control}
        errors={errors}
      >
        {(field) => (
          <Input
            type="number"
            placeholder={i18nString("exampleItemExchange")}
            className="no-spinner"
            {...field}
            value={numericInputValue(field.value)}
            onChange={(e) => field.onChange(parseNumericInput(e))}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
          />
        )}
      </FormField>

      <FormField
        name="notes"
        label={i18nString("notes")}
        control={control}
        errors={errors}
      >
        {(field) => (
          <Textarea
            rows={2}
            placeholder={i18nString("descriptionNote")}
            {...field}
            value={field.value || ""}
          />
        )}
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? <><ButtonSpinner />{i18nString("saving")}</> : i18nString("save")}
      </Button>
    </form>
  );
};
