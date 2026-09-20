import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useUpdateBudget } from "../hooks/useUpdateBudget";
import { useGetBudgets } from "../hooks/useGetBudgets";
import type { AppError } from "@/lib/errorMessages";

export const EditBudgetDialog = () => {
  const { id } = useParams<{ id: string }>();
  const i18nString = useModuleTranslation("budgets");
  const navigate = useNavigate();
  const updateBudget = useUpdateBudget();
  const { data: budgets, isLoading } = useGetBudgets();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const [amount, setAmount] = useState("");

  // Encontrar el presupuesto a editar
  const budgetToEdit = budgets.find((b) => b.id === id);

  useEffect(() => {
    if (budgetToEdit) {
      setAmount(String(budgetToEdit.amount_usd));
    }
  }, [budgetToEdit]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!id || !amount || submitted.current) return;
    submitted.current = true;
    updateBudget.mutate(
      { id, amount_usd: parseFloat(amount) },
      {
        onSuccess: () => { toast.success(i18nString("updateSuccess")); handleClose(); },
        onError: (error: AppError) => {
          submitted.current = false;
          toast.error(i18nString("updateError"), { description: error.message });
        },
      }
    );
  };

  const isPending = updateBudget.isPending || submitted.current || isLoading;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{i18nString("editBudget")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!budgetToEdit) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{i18nString("editBudget")}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-muted-foreground">{i18nString("budgetNotFound")}</p>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18nString("editBudget")} · {budgetToEdit.categories?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{i18nString("amountUSD")}</Label>
            <Input
              type="number"
              className="no-spinner"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button className="w-full mt-2" onClick={handleSave} disabled={isPending}>
            {isPending ? <><ButtonSpinner />{i18nString("updating")}</> : i18nString("updateBudget")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
