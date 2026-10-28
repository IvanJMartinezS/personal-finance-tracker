import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useGetBudgets } from "../hooks/useGetBudgets";
import { useCorrectBudgetMonth } from "../hooks/useCorrectBudgetMonth";
import { firstApplicableMonth } from "../utils/calculateBudgetHistory";
import { resolveBudgetAmountForMonth } from "../utils/resolveBudgetAmountForMonth";
import { getDefaultYear, getElapsedMonthsInYear } from "@/lib/dateUtils";
import type { AppError } from "@/lib/errorMessages";

const MONTH_KEYS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const CorrectBudgetMonthDialog = () => {
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("budgets");
  const navigate = useNavigate();
  const correctMonth = useCorrectBudgetMonth();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const { data: budgets, isLoading } = useGetBudgets();

  const year = getDefaultYear();
  const elapsedMonths = getElapsedMonthsInYear(year);

  const [budgetId, setBudgetId] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const selectedBudget = budgets.find((b) => b.id === budgetId);

  // Meses de `year` en los que el presupuesto elegido ya existía (desde que
  // se creó hasta el mes actual) — no tiene sentido corregir un mes anterior
  // a su creación, ni uno que todavía no ha transcurrido.
  const availableMonths = useMemo(() => {
    if (!selectedBudget) return [];
    const startMonth = firstApplicableMonth(selectedBudget.created_at, year);
    if (startMonth === null) return [];
    return Array.from({ length: elapsedMonths - startMonth + 1 }, (_, i) => startMonth + i);
  }, [selectedBudget, year, elapsedMonths]);

  // Al elegir categoría + mes, precarga el monto que YA regía ese mes (en vez
  // de dejar el campo vacío) — así el usuario ve lo que va a sobrescribir.
  useEffect(() => {
    if (!selectedBudget || !month) return;
    const current = resolveBudgetAmountForMonth(selectedBudget.amount_usd, selectedBudget.budget_monthly_amounts, year, Number(month));
    setAmount(String(current));
  }, [selectedBudget, month, year]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!selectedBudget || !month || !amount || submitted.current) return;
    submitted.current = true;
    correctMonth.mutate(
      {
        budgetId: selectedBudget.id,
        userId: selectedBudget.user_id,
        year,
        month: Number(month),
        amountUsd: parseFloat(amount),
      },
      {
        onSuccess: () => { toast.success(i18nString("correctMonthSuccess")); handleClose(); },
        onError: (error: AppError) => {
          submitted.current = false;
          toast.error(i18nString("correctMonthError"), { description: error.message });
        },
      }
    );
  };

  const isPending = correctMonth.isPending || submitted.current;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18nString("correctMonth")}</DialogTitle>
          <p className="text-xs text-muted-foreground">{i18nString("correctMonthHint")}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{i18nString("category")}</Label>
              <Select value={budgetId} onValueChange={(v) => { setBudgetId(v); setMonth(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder={i18nString("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.categories?.color ?? "#888" }} />
                        {b.categories?.name ?? i18nString("uncategorized")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{i18nString("historyMonth")}</Label>
              <Select value={month} onValueChange={setMonth} disabled={!selectedBudget}>
                <SelectTrigger>
                  <SelectValue placeholder={i18nString("selectMonth")} />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {t(`months.${MONTH_KEYS[m - 1]}`)} {year}
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
                disabled={!month}
              />
            </div>

            <Button className="w-full mt-2" onClick={handleSave} disabled={isPending || !month || !amount}>
              {isPending ? <><ButtonSpinner />{i18nString("correcting")}</> : i18nString("correct")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
