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
import { getIncomeSchema, type IncomeFormValues } from "@/schemas/incomeSchema";
import { useCreateIncome } from "../hooks/useGetCreateIncome";
import { IncomeForm } from "../components/IncomeForm";
import type { Category } from "../utils/types";

interface CreateIncomeDialogProps {
  categories: Category[];
}

export const CreateIncomeDialog = ({ categories }: CreateIncomeDialogProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);
  const createIncome = useCreateIncome();
  const [open, setOpen] = useState(false);

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
          {i18nString("newIncome")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString("registerIncome")}</DialogTitle>
        </DialogHeader>
        <IncomeForm
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
