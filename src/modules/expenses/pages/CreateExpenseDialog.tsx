import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { getExpenseSchema, type ExpenseFormValues } from "@/schemas/expenseSchema";
import { useCreateExpense } from "../hooks/useGetCreateExpense";
import { ExpenseForm } from "../components/ExpenseForm";
import type { Category } from "../utils/types";

interface CreateExpenseDialogProps {
  categories: Category[];
}

export const CreateExpenseDialog = ({ categories }: CreateExpenseDialogProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`expenses.${key}`);
  const createExpense = useCreateExpense();
  const [open, setOpen] = useState(false);

  const expenseSchema = getExpenseSchema(t);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      item: "",
      amount: undefined,
      currency: "COP",
      exchange_rate: undefined,
      notes: "",
    },
  });

  const { handleSubmit, reset, control, formState } = form;

  const onSubmit = (data: ExpenseFormValues) => {
    const amount_in_base = data.amount * (data.exchange_rate || 1);
    createExpense.mutate(
      {
        ...data,
        amount_in_base,
        notes: data.notes || null,
        exchange_rate: data.currency === "COP" ? 1 : data.exchange_rate,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
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
          {i18nString("newExpense")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString("registerExpense")}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          control={control}
          errors={formState.errors}
          categories={categories}
          i18nString={i18nString}
          isSubmitting={formState.isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        />
      </DialogContent>
    </Dialog>
  );
};