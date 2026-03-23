import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { CURRENCIES } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import type { Category } from "../utils/types"; 

interface CreateIncomeDialogProps {
  categories: Category[]; 
  createIncome: any; 
  onSuccess?: () => void;
}

export const CreateIncome = ({ categories, createIncome, onSuccess }: CreateIncomeDialogProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('incomes.' + key);

  const [open, setOpen] = useState(false);

  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("COP");
  const [formRate, setFormRate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const resetForm = () => {
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCategory("");
    setFormSource("");
    setFormAmount("");
    setFormCurrency("COP");
    setFormRate("");
    setFormNotes("");
  };

  const handleSave = () => {
    const amount = parseFloat(formAmount);
    const rate = formCurrency === "COP" ? 1 : parseFloat(formRate);
    if (!formCategory || !formSource || isNaN(amount) || (formCurrency !== "COP" && isNaN(rate))) return;

    createIncome.mutate(
      {
        date: formDate,
        category_id: formCategory,
        source: formSource,
        amount,
        currency: formCurrency,
        exchange_rate: rate,
        amount_in_base: amount * rate,
        notes: formNotes || null,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {i18nString('newIncome')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{i18nString('registerIncome')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{i18nString('date')}</Label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{i18nString('category')}</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={i18nString('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      {i18nString('noRecords')}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{i18nString('source')}</Label>
            <Input
              value={formSource}
              onChange={(e) => setFormSource(e.target.value)}
              placeholder={i18nString('exampleSource')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{i18nString('amount')}</Label>
              <Input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{i18nString('currency')}</Label>
              <Select value={formCurrency} onValueChange={setFormCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} - {c.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formCurrency !== "COP" && (
            <div className="space-y-1.5">
              <Label>{i18nString('exchangeRate')}</Label>
              <Input
                type="number"
                value={formRate}
                onChange={(e) => setFormRate(e.target.value)}
                placeholder="Ej: 4200"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{i18nString('notes')}</Label>
            <Textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder={i18nString('descriptionNote')}
              rows={2}
            />
          </div>

          <Button className="w-full mt-2" onClick={handleSave}>
            {i18nString('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};