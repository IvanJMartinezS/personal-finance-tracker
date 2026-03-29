import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useCreateAccount } from "../hooks/useCreateAccount";
import type { AccountCurrency, AccountType } from "../utils/types";

const PRESET_COLORS = [
  "#10b981","#f59e0b","#6366f1","#ec4899","#14b8a6",
  "#8b5cf6","#f97316","#3b82f6","#22c55e","#ef4444","#06b6d4",
];

export const CreateAccountDialog = () => {
  const i18nString = useModuleTranslation("accounts");
  const navigate = useNavigate();
  const createAccount = useCreateAccount();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<AccountCurrency>("USD");
  const [type, setType] = useState<AccountType>("savings");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(t);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!name || submitted.current) return;
    submitted.current = true;
    createAccount.mutate(
      { name, currency, type, color, is_active: true },
      {
        onSuccess: () => { toast.success(i18nString("createSuccess")); handleClose(); },
        onError: (e: Error) => { submitted.current = false; toast.error(i18nString("createError"), { description: e.message }); },
      }
    );
  };

  const isPending = createAccount.isPending || submitted.current;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18nString("newAccount")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{i18nString("accountName")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={i18nString("accountNamePlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{i18nString("currency")}</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as AccountCurrency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="COP">COP $</SelectItem>
                  <SelectItem value="VES">VES Bs.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{i18nString("accountType")}</Label>
              <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">{i18nString("typeSavings")}</SelectItem>
                  <SelectItem value="investment">{i18nString("typeInvestment")}</SelectItem>
                  <SelectItem value="owed_to_me">{i18nString("typeOwedToMe")}</SelectItem>
                  <SelectItem value="cash">{i18nString("typeCash")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{i18nString("color")}</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-all ${color === c ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSave} disabled={isPending}>
            {isPending ? <><ButtonSpinner />{i18nString("saving")}</> : i18nString("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
