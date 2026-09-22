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
import { getIncomeSchema, type IncomeFormValues } from "@/schemas/incomeSchema";
import { calculateAmountInBaseUSD } from "@/lib/mock-data";
import type { AppError } from "@/lib/errorMessages";
import { useUpdateIncomes } from "../hooks/useUpdateIncomes";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useGetIncomes } from "../hooks/useGetIncomes";
import { IncomeForm } from "../components/IncomeForm";
import type { Income } from "@/types";

export const EditIncomeDialog = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("incomes");
  const navigate = useNavigate();
  const updateIncome = useUpdateIncomes();
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const { data: categories } = useGetCategories("income");

  // Encontrar el ingreso a editar
  const incomeToEdit = incomes?.find((i: Income) => i.id === id);

  const incomeSchema = getIncomeSchema(t);
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      source: "",
      amount: undefined,
      currency: "USD",
      exchange_rate: undefined,
      notes: "",
    },
  });

  const { handleSubmit, control, formState, setValue } = form;

  // Cargar datos del ingreso a editar
  useEffect(() => {
    if (incomeToEdit) {
      setValue("date", incomeToEdit.date);
      setValue("category_id", incomeToEdit.category_id || "");
      setValue("source", incomeToEdit.source);
      setValue("amount", incomeToEdit.amount);
      setValue("currency", incomeToEdit.currency);
      // Si es USD y la tasa guardada es 1 (el valor por defecto cuando no se
      // dio ninguna), se deja en blanco en vez de precargar un "1" engañoso.
      const hasNoSpecificRate = incomeToEdit.currency === "USD" && incomeToEdit.exchange_rate === 1;
      setValue("exchange_rate", hasNoSpecificRate ? undefined : incomeToEdit.exchange_rate || undefined);
      setValue("notes", incomeToEdit.notes || "");
    }
  }, [incomeToEdit, setValue]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const onSubmit = (data: IncomeFormValues) => {
    if (!id || submitted.current) return;
    submitted.current = true;
    const amount_in_base = calculateAmountInBaseUSD(data.amount, data.currency, data.exchange_rate);
    updateIncome.mutate(
      {
        id,
        ...data,
        amount_in_base,
        notes: data.notes || null,
        // La tasa siempre es requerida (ver transactionSchema.ts), así que
        // aquí siempre viene con un valor válido — no hace falta un default.
        exchange_rate: data.exchange_rate!,
      },
      {
        onSuccess: () => {
          toast.success(i18nString("updateSuccess"));
          handleClose();
        },
        onError: (error: AppError) => {
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

  const isSubmitting = formState.isSubmitting || submitted.current || incomesLoading;

  if (incomesLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("editIncome")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!incomeToEdit) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("editIncome")}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-muted-foreground">{i18nString("incomeNotFound")}</p>
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
          <DialogTitle>{i18nString("editIncome")}</DialogTitle>
        </DialogHeader>
        <IncomeForm
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