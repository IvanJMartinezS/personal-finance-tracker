import { useState } from "react";
import { Plus, Search, TrendingDown, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Filter } from "@/shared/components/ui/Filter";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { CURRENCIES, formatCOP, formatCurrency} from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useDeleteExpense } from "@/modules/expenses/hooks/useDeleteExpense";
import { useCreateExpense } from "@/modules/expenses/hooks/useGetCreateExpense";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useTranslation } from "react-i18next";

export const ExpensesList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);


  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("");
  const [formItem, setFormItem] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("COP");
  const [formRate, setFormRate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense"); 
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();

  const createExpense = useCreateExpense();
  const deletedExpenses = useDeleteExpense();

  const filtered = (expenses ?? []).filter(e => {
    const matchSearch = e.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "all" || e.category_id === filterCategory;
    const matchCur = filterCurrency === "all" || e.currency === filterCurrency;
    return matchSearch && matchCat && matchCur;
  });

  const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount_in_base), 0);

  const resetForm = () => {
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCategory("");
    setFormItem("");
    setFormAmount("");
    setFormCurrency("COP");
    setFormRate("");
    setFormNotes("");
  };

  const handleSave = () => {
    const amount = parseFloat(formAmount);
    const rate = formCurrency === "COP" ? 1 : parseFloat(formRate);
    if (!formCategory || !formItem || isNaN(amount) || (formCurrency !== "COP" && isNaN(rate))) return;

    createExpense.mutate({
      date: formDate,
      category_id: formCategory,
      item: formItem,
      amount,
      currency: formCurrency,
      exchange_rate: rate,
      amount_in_base: amount * rate,
      notes: formNotes || null,
    }, {
      onSuccess: () => { setDialogOpen(false); resetForm(); },
    });
  };

  if (expensesLoading || categoriesLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {i18nString('resumen')}<span className="money-font text-destructive">{formatCOP(totalFiltered)}</span>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> {i18nString('newExpense')}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{i18nString('registerExpense')}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{i18nString('date')}</Label>
                  <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{i18nString('category')}</Label>
                  <Filter
                    value={formCategory}
                    onValueChange={setFormCategory}
                    items={categories || []}
                    firstValue={categories?.length > 0 ? categories[0].name : 'all'}
                    placeholder={i18nString('selectCategory')}
                    getKey={(c: any) => c.id}
                    getValue={(c: any) => c.id}
                    renderLabel={(c: any) => (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{i18nString('item')}</Label>
                <Input value={formItem} onChange={e => setFormItem(e.target.value)} placeholder={i18nString('exampleItem')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{i18nString('amount')}</Label>
                  <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>{i18nString('currency')}</Label>
                  <Filter
                    value={formCurrency}
                    onValueChange={setFormCurrency}
                    items={CURRENCIES}
                    getKey={(c: any) => c.code}
                    getValue={(c: any) => c.code}
                    renderLabel={(c: any) => <>{c.code} - {c.symbol}</>}
                  />
                </div>
              </div>
              {formCurrency !== "COP" && (
                <div className="space-y-1.5">
                  <Label>{i18nString('exchangeRate')}</Label>
                  <Input type="number" value={formRate} onChange={e => setFormRate(e.target.value)} placeholder="Ej: 4200" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>{i18nString('notes')}</Label>
                <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder={i18nString('descriptionNote')} rows={2} />
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                {i18nString('save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder={i18nString('searchExpenses')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Filter
          value={filterCategory}
          onValueChange={setFilterCategory}
          items={categories}
          placeholder="Categoría"
          className="w-[160px]"
          getKey={(c: any) => c.id}
          getValue={(c: any) => c.id}
          renderLabel={(c: any) => <>{c.name}</>}
          allLabel={i18nString('allLabel')}
        />
        <Filter
          value={filterCurrency}
          onValueChange={setFilterCurrency}
          items={CURRENCIES}
          placeholder="Moneda"
          className="w-[120px]"
          getKey={(c: any) => c.code}
          getValue={(c: any) => c.code}
          renderLabel={(c: any) => <>{c.code}</>}
          allLabel={i18nString('allLabel')}
        />
      </div>

      {/* List */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{i18nString('noRecords')}</p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(expense => {
                const cat = expense.categories as any;
                return (
                  <div key={expense.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors sm:px-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: (cat?.color ?? '#888') + '20' }}>
                      <TrendingDown className="h-4 w-4" style={{ color: cat?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{expense.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat?.name} · {new Date(expense.date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold money-font text-destructive">
                        -{formatCurrency(Number(expense.amount), expense.currency)}
                      </p>
                      {expense.currency !== 'COP' && (
                        <p className="text-[10px] text-muted-foreground money-font">({formatCOP(Number(expense.amount_in_base))})</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{i18nString('deleteExpense')}</AlertDialogTitle>
                            <AlertDialogDescription>{i18nString('deleteExpenseDescription')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{i18nString('cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletedExpenses.mutate(expense.id)}>{i18nString('delete')}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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