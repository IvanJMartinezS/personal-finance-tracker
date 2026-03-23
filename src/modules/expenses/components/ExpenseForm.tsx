// src/modules/expenses/components/ExpenseForm.tsx
import { useWatch } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { CURRENCIES } from "@/lib/mock-data";
import { FormField } from "@/shared/components/FormField";
import type { Control, FieldErrors } from "react-hook-form";
import type { ExpenseFormValues } from "@/schemas/expenseSchema";
import type { Category } from "../utils/types";

interface ExpenseFormProps {
  control: Control<ExpenseFormValues>;
  errors: FieldErrors<ExpenseFormValues>;
  categories: Category[];
  i18nString: (key: string) => string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const ExpenseForm = ({
  control,
  errors,
  categories,
  i18nString,
  isSubmitting,
  onSubmit,
}: ExpenseFormProps) => {
  const watchCurrency = useWatch({ control, name: "currency" });

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
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : e.target.valueAsNumber);
              }}
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
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      {watchCurrency !== "COP" && (
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
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : e.target.valueAsNumber);
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
            />
          )}
        </FormField>
      )}

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
        {isSubmitting ? i18nString("saving") : i18nString("save")}
      </Button>
    </form>
  );
};