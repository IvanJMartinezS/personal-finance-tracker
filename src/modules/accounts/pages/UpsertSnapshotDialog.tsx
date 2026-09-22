import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useUpsertSnapshot } from "../hooks/useUpsertSnapshot";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { getDefaultYear, getElapsedMonthsInYear } from "@/lib/dateUtils";

const MONTH_KEYS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const UpsertSnapshotDialog = () => {
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("accounts");
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // Año que el usuario tenía seleccionado en la página de cuentas al abrir
  // este modal (ver `AccountsPage` → `handleRegisterBalance`).
  const { year = getDefaultYear() } = (location.state as { year?: number }) ?? {};
  const currentMonth = getElapsedMonthsInYear(year);
  const upsert = useUpsertSnapshot();
  const { data: accounts } = useGetAccounts();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const account = accounts?.find((a) => a.id === accountId);
  const needsExchangeRate = account?.currency !== "USD";

  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; exchangeRate?: string }>({});

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(t);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!accountId || submitted.current) return;

    const nextErrors: { amount?: string; exchangeRate?: string } = {};
    if (!amount) nextErrors.amount = i18nString("amountRequired");
    if (needsExchangeRate && !exchangeRate) nextErrors.exchangeRate = i18nString("exchangeRateRequired");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submitted.current = true;
    upsert.mutate(
      {
        account_id: accountId,
        amount: parseFloat(amount),
        year,
        month: currentMonth,
        // La tasa solo aplica a cuentas que no están en USD — para USD no
        // hace falta convertir nada.
        exchange_rate: needsExchangeRate ? parseFloat(exchangeRate) : null,
        notes: notes || null,
      },
      {
        onSuccess: () => { toast.success(i18nString("registerBalanceSuccess")); handleClose(); },
        onError: (e: Error) => { submitted.current = false; toast.error(i18nString("registerBalanceError"), { description: e.message }); },
      }
    );
  };

  const isPending = upsert.isPending || submitted.current;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {account
              ? `${i18nString("registerBalance")} · ${account.name} (${account.currency})`
              : i18nString("registerBalance")}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {t(`months.${MONTH_KEYS[currentMonth - 1]}`)} {year}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{i18nString("amount")} {account ? `(${account.currency})` : ""}</Label>
            <Input
              type="number"
              className="no-spinner"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
          </div>

          {needsExchangeRate && (
            <div className="space-y-1.5">
              <Label>{i18nString("exchangeRate", { currency: account?.currency })}</Label>
              <Input
                type="number"
                className="no-spinner"
                placeholder={i18nString("exchangeRateExample")}
                value={exchangeRate}
                onChange={(e) => {
                  setExchangeRate(e.target.value);
                  if (errors.exchangeRate) setErrors((prev) => ({ ...prev, exchangeRate: undefined }));
                }}
              />
              {errors.exchangeRate && <p className="text-sm text-destructive">{errors.exchangeRate}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{i18nString("notes")}</Label>
            <Textarea rows={2} placeholder={i18nString("notesPlaceholder")} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button className="w-full mt-2" onClick={handleSave} disabled={isPending}>
            {isPending ? <><ButtonSpinner />{i18nString("saving")}</> : i18nString("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
