import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useGetIncomes } from "../hooks/useGetIncomes";
import type { Income } from "@/types";

export const ViewIncomeDialog = () => {
  const { id } = useParams<{ id: string }>();
  const i18nString = useModuleTranslation("incomes");
  const navigate = useNavigate();
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();
  const [open, setOpen] = useState(true);

  const income = incomes?.find((i: Income) => i.id === id);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  if (incomesLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("viewIncome")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!income) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18nString("viewIncome")}</DialogTitle>
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
          <DialogTitle>{i18nString("viewIncome")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm font-medium">{income.source}</p>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{i18nString("notes")}</p>
            <p className="text-sm whitespace-pre-wrap rounded-md border bg-muted/30 p-3">
              {income.notes}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
