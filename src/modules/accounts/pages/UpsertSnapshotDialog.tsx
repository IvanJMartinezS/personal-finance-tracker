import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const YEAR = 2026;
const currentMonth = new Date().getFullYear() === YEAR ? new Date().getMonth() + 1 : 12;

export const UpsertSnapshotDialog = () => {
  const i18nString = useModuleTranslation("accounts");
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const upsert = useUpsertSnapshot();
  const { data: accounts } = useGetAccounts();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const account = accounts?.find((a) => a.id === accountId);

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(t);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!accountId || !amount || submitted.current) return;
    submitted.current = true;
    upsert.mutate(
      { account_id: accountId, amount: parseFloat(amount), year: YEAR, month: currentMonth, notes: notes || null },
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
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{i18nString("amount")} {account ? `(${account.currency})` : ""}</Label>
            <Input
              type="number"
              className="no-spinner"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
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
