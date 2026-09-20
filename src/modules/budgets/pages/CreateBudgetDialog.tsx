import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useCreateBudget } from "../hooks/useCreateBudget";
import { useGetBudgets } from "../hooks/useGetBudgets";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { getAvailableCategoriesForBudget } from "../utils/getAvailableCategoriesForBudget";
import type { AppError } from "@/lib/errorMessages";

export const CreateBudgetDialog = () => {
  const i18nString = useModuleTranslation("budgets");
  const navigate = useNavigate();
  const createBudget = useCreateBudget();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense");
  const { data: budgets, isLoading: budgetsLoading } = useGetBudgets();

  const availableCategories = getAvailableCategoriesForBudget(categories ?? [], budgets);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!categoryId || !amount || submitted.current) return;
    submitted.current = true;
    createBudget.mutate(
      { category_id: categoryId, amount_usd: parseFloat(amount) },
      {
        onSuccess: () => { toast.success(i18nString("createSuccess")); handleClose(); },
        onError: (error: AppError) => {
          submitted.current = false;
          if (error.code === "23505") {
            toast.error(i18nString("duplicateCategory"));
          } else if (error.code === "22P02") {
            toast.error(i18nString("invalidCategory"));
          } else {
            toast.error(i18nString("createError"), { description: error.message });
          }
        },
      }
    );
  };

  const isLoading = categoriesLoading || budgetsLoading;
  const isPending = createBudget.isPending || submitted.current;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18nString("newBudget")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        ) : availableCategories.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">{i18nString("noAvailableCategories")}</p>
            <Button onClick={handleClose} className="mt-4">
              {i18nString("close")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{i18nString("category")}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={i18nString("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {isPending ? <><ButtonSpinner />{i18nString("saving")}</> : i18nString("saveBudget")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
