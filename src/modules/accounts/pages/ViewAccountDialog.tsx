import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { useGetSnapshots } from "../hooks/useGetSnapshots";
import { toUSD, fmtUSD } from "../hooks/useAccountsSummary";
import { formatCurrency } from "@/lib/mock-data";
import { getDefaultYear, getElapsedMonthsInYear } from "@/lib/dateUtils";

const MONTH_KEYS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const ViewAccountDialog = () => {
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("accounts");
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // Año que el usuario tenía seleccionado en la página de cuentas al abrir
  // este modal (misma convención que UpsertSnapshotDialog).
  const { year = getDefaultYear() } = (location.state as { year?: number }) ?? {};
  const currentMonth = getElapsedMonthsInYear(year);

  const { data: accounts, isLoading: accountsLoading } = useGetAccounts();
  const { data: snapshots, isLoading: snapshotsLoading } = useGetSnapshots(year);
  const [open, setOpen] = useState(true);

  const account = accounts?.find((a) => a.id === accountId);
  const snapshot = snapshots?.find((s) => s.account_id === accountId && s.month === currentMonth);
  const usdEquivalent = snapshot && account && account.currency !== "USD"
    ? toUSD(snapshot.amount, account.currency, snapshot.exchange_rate)
    : null;

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const isLoading = accountsLoading || snapshotsLoading;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {account ? `${i18nString("viewAccount")} · ${account.name}` : i18nString("viewAccount")}
          </DialogTitle>
          {account && (
            <p className="text-xs text-muted-foreground">
              {t(`months.${MONTH_KEYS[currentMonth - 1]}`)} {year} · {account.currency}
            </p>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <ButtonSpinner />
          </div>
        ) : !account ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">{i18nString("accountNotFound")}</p>
            <Button onClick={handleClose} className="mt-4">{i18nString("close")}</Button>
          </div>
        ) : !snapshot ? (
          <p className="py-4 text-center text-sm text-muted-foreground italic">{i18nString("noBalance")}</p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{i18nString("amount")}</p>
              <p className="text-lg font-semibold money-font">{formatCurrency(snapshot.amount, account.currency)}</p>
              {usdEquivalent !== null && (
                <p className="text-sm text-muted-foreground money-font">{fmtUSD(usdEquivalent)}</p>
              )}
            </div>

            {account.currency !== "USD" && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">{i18nString("exchangeRateUsed")}</p>
                <p className="text-sm">
                  {snapshot.exchange_rate
                    ? t("accounts.exchangeRateValue", { rate: snapshot.exchange_rate, currency: account.currency })
                    : i18nString("exchangeRateUnknown")}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{i18nString("notes")}</p>
              <p className="text-sm whitespace-pre-wrap rounded-md border bg-muted/30 p-3">
                {snapshot.notes || i18nString("noNotes")}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
