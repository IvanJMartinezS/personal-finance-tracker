import { useState } from "react";
import { Plus, TrendingUp, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { CURRENCIES, formatCOP, formatCurrency,MONTHS } from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useGetIncomes } from "../hooks/useGetIncomes";
import { useCreateIncome } from "../hooks/useGetCreateIncome";
import { useDeleteIncome } from "../hooks/useDeleteIncome";
import { useTranslation } from "react-i18next";
import type { Category, Currency, Month } from "../utils/types"; 
import { useIncomeFilters } from "../hooks/useIncomeFilters";
import { Filters } from "@/shared/components/Filters";

export const IncomeList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('incomes.' + key);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("COP");
  const [formRate, setFormRate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const { data: categories, isLoading } = useGetCategories();

  const incomeCategories = categories?.filter(c => c.type === "income") ?? [];
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();
  const createIncome = useCreateIncome();
  const deleteIncome = useDeleteIncome();

  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    filteredIncomes,
    totalFiltered,
    clearFilters,
  } = useIncomeFilters({ incomes: incomes ?? [], categories: categories ?? [] });

  const resetForm = () => {
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCategory(""); setFormSource(""); setFormAmount("");
    setFormCurrency("COP"); setFormRate(""); setFormNotes("");
  };

  const handleSave = () => {
    const amount = parseFloat(formAmount);
    const rate = formCurrency === "COP" ? 1 : parseFloat(formRate);
    if (!formCategory || !formSource || isNaN(amount) || (formCurrency !== "COP" && isNaN(rate))) return;

    createIncome.mutate({
      date: formDate,
      category_id: formCategory,
      source: formSource,
      amount,
      currency: formCurrency,
      exchange_rate: rate,
      amount_in_base: amount * rate,
      notes: formNotes || null,
    }, {
      onSuccess: () => { setDialogOpen(false); resetForm(); },
    });
  };

  if (isLoading || incomesLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  const filterConfigs = [
      {
        id: 'category',
        label: 'Categoría',
        value: filterCategory,
        onChange: setFilterCategory,
        options: categories ?? [],
        placeholder: 'Categoría',
        getOptionKey: (cat: Category) => cat.id,
        getOptionValue: (cat: Category) => cat.id,
        renderOption: (cat: Category) => (
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.name}
          </span>
        ),
        className: 'w-[160px]',
      },
      {
        id: 'currency',
        label: 'Moneda',
        value: filterCurrency,
        onChange: setFilterCurrency,
        options: CURRENCIES,
        placeholder: 'Moneda',
        getOptionKey: (cur: Currency) => cur.code,
        getOptionValue: (cur: Currency) => cur.code,
        renderOption: (cur: Currency) => <>{cur.code}</>,
        className: 'w-[120px]',
      },
      {
        id: 'month',
        label: 'Mes',
        value: filterMonth,
        onChange: setFilterMonth,
        options: MONTHS,
        placeholder: 'Mes',
        getOptionKey: (m: Month) => m.item,
        getOptionValue: (m: Month) => m.item, 
        renderOption: (m: Month) => <>{m.item}</>,
        className: 'w-[120px]',
      },
    ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {filteredIncomes.length} {i18nString("resumen")}<span className="money-font text-success">{formatCOP(totalFiltered)}</span>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> {i18nString("newIncome")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{i18nString("registerIncome")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{i18nString("date")}</Label>
                  <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{i18nString("category")}</Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger><SelectValue placeholder={i18nString('selectCategory')} /></SelectTrigger>
                      <SelectContent>
                        {incomeCategories.length > 0 ? (
                          incomeCategories.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                                {c.name}
                              </span>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            {i18nString("noRecords")}
                          </SelectItem>
                        )}
                      </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Fuente</Label>
                <Input value={formSource} onChange={e => setFormSource(e.target.value)} placeholder={i18nString('exampleItem')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monto</Label>
                  <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>{i18nString("currency")}</Label>
                  <Select value={formCurrency} onValueChange={setFormCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.symbol}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formCurrency !== "COP" && (
                <div className="space-y-1.5">
                  <Label>{i18nString("exchangeRate")}</Label>
                  <Input type="number" value={formRate} onChange={e => setFormRate(e.target.value)} placeholder="Ej: 4200" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>{i18nString("notes")}</Label>
                <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder={i18nString("descriptionNote")} rows={2} />
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                {i18nString("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Filters
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: i18nString('searchIncomes'),
        }}
        filters={filterConfigs}
        onClearAll={clearFilters}
      />

      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {filteredIncomes.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{i18nString("noRecords")}</p>
          ) : (
            <div className="divide-y divide-border">
              {filteredIncomes.map(income => {
                const cat = income.categories as any;
                return (
                  <div key={income.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors sm:px-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: (cat?.color ?? '#888') + '20' }}>
                      <TrendingUp className="h-4 w-4" style={{ color: cat?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{income.source}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat?.name} · {new Date(income.date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold money-font text-success">+{formatCurrency(Number(income.amount), income.currency)}</p>
                      {income.currency !== 'COP' && (
                        <p className="text-[10px] text-muted-foreground money-font">({formatCOP(Number(income.amount_in_base))})</p>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{i18nString("deleteIncome")}</AlertDialogTitle>
                          <AlertDialogDescription>{i18nString("deleteIncomeDescription")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{i18nString("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteIncome.mutate(income.id)}>{i18nString("delete")}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
