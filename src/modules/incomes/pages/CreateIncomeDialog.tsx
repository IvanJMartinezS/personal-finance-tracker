import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getIncomeSchema, type IncomeFormValues } from "@/schemas/incomeSchema";
import { useCreateIncome } from "../hooks/useGetCreateIncome";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { IncomeForm } from "../components/IncomeForm";

export const CreateIncomeDialog = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);
  const navigate = useNavigate();
  const createIncome = useCreateIncome();
  const [open, setOpen] = useState(true);

  const { data: categories } = useGetCategories("income");

  const incomeSchema = getIncomeSchema(t);
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category_id: "",
      source: "",
      amount: undefined,
      currency: "COP",
      exchange_rate: undefined,
      notes: "",
    },
  });

  const { handleSubmit, reset, control, formState } = form;

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const onSubmit = (data: IncomeFormValues) => {
    const amount_in_base = data.amount * (data.exchange_rate || 1);
    createIncome.mutate(
      {
        ...data,
        amount_in_base,
        notes: data.notes || null,
        exchange_rate: data.currency === "COP" ? 1 : data.exchange_rate!,
      },
      {
        onSuccess: () => {
          reset();
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString("registerIncome")}</DialogTitle>
        </DialogHeader>
        <IncomeForm
          control={control}
          errors={formState.errors}
          categories={categories ?? []}
          i18nString={i18nString}
          isSubmitting={formState.isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        />
      </DialogContent>
    </Dialog>
  );
};
