import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { getExpenseSchema, type ExpenseFormValues } from "@/schemas/expenseSchema";
import { useUpdateExpense } from "../hooks/useUpdateExpense";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useGetExpenses } from "../hooks/useGetExpenses";
import { ExpenseForm } from "../components/ExpenseForm";
import type { Expense } from "@/types";

export const EditExpenseDialog = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("expenses");
  const navigate = useNavigate();
  const updateExpense = useUpdateExpense();
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const { data: categories } = useGetCategories("expense");

  // Encontrar el gasto a editar
  const expenseToEdit = expenses?.find((e: Expense) => e.id === id);

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

  const { handleSubmit, control, formState, setValue } = form;

  // Cargar datos del gasto a editar
  useEffect(() => {
    if (expenseToEdit) {
      setValue("date", expenseToEdit.date);
      setValue("category_id", expenseToEdit.category_id || "");
      setValue("item", expenseToEdit.item);
      setValue("amount", expenseToEdit.amount);
      setValue("currency", expenseToEdit.currency);
      setValue("exchange_rate", expenseToEdit.exchange_rate || undefined);
      setValue("notes", expenseToEdit.notes || "");
    }
  }, [expenseToEdit, setValue]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const onSubmit = (data: ExpenseFormValues) => {
    if (!id || submitted.current) return;
    submitted.current = true;
    const amount_in_base = data.amount * (data.exchange_rate || 1);
    updateExpense.mutate(
      {
        id,
        ...data,
        amount_in_base,
        notes: data.notes || null,
        exchange_rate: data.currency === "COP" ? 1 : data.exchange_rate,
      },
      {
        onSuccess: () => {
          toast.success(i18nString("updateSuccess"));
          handleClose();
        },
        onError: (error: any) => {
          submitted.current = false;
          if (error.code === '22P02') {
            toast.error(i18nString("invalidCategory"));
          } else {
            toast.error(i18nString("updateError"), { description: error.message });
          }
        },
      }
    );
  };

  const isSubmitting = formState.isSubmitting || submitted.current || expensesLoading;

  if (expensesLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("editExpense")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!expenseToEdit) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("editExpense")}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-muted-foreground">{i18nString("expenseNotFound")}</p>
            <Button onClick={handleClose} className="mt-4">
              {i18nString("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString("editExpense")}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          control={control}
          errors={formState.errors}
          categories={categories ?? []}
          i18nString={i18nString}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        />
      </DialogContent>
    </Dialog>
  );
};