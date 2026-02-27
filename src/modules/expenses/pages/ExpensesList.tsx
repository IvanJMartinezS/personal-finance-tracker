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
import { CURRENCIES, formatCOP, formatCurrency, mockExpenses, mockCategories} from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ExpensesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCurrency, setFilterCurrency] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("");
  const [formItem, setFormItem] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("COP");
  const [formRate, setFormRate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const { data: categories, isLoading: categoriesLoading } = { data: mockCategories, isLoading: false };
  const { data: expenses, isLoading } = { data: mockExpenses, isLoading: false };

  const expenseCategories = categories?.filter(c => c.type === "expense") ?? [];

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
   console.log("create expense");
  };

  if (isLoading || categoriesLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} registros · Total: <span className="money-font text-destructive">{formatCOP(totalFiltered)}</span>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo gasto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Registrar gasto</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Fecha</Label>
                  <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Categoría</Label>
                  <Filter
                    value={formCategory}
                    onValueChange={setFormCategory}
                    items={expenseCategories}
                    placeholder="Seleccionar"
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
                <Label>Ítem</Label>
                <Input value={formItem} onChange={e => setFormItem(e.target.value)} placeholder="Ej: Supermercado Éxito" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monto</Label>
                  <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>Moneda</Label>
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
                  <Label>Tasa de cambio a COP</Label>
                  <Input type="number" value={formRate} onChange={e => setFormRate(e.target.value)} placeholder="Ej: 4200" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Notas (opcional)</Label>
                <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Notas adicionales..." rows={2} />
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                Guardar gasto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar gastos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Filter
          value={filterCategory}
          onValueChange={setFilterCategory}
          items={expenseCategories}
          placeholder="Categoría"
          className="w-[160px]"
          getKey={(c: any) => c.id}
          getValue={(c: any) => c.id}
          renderLabel={(c: any) => <>{c.name}</>}
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
        />
      </div>

      {/* List */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No hay gastos registrados</p>
          ) : (
            <div className="divide-y divide-border">
              {expenses.map(expense => {
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
                            <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => console.log("Eliminar gasto", expense.id)}>Eliminar</AlertDialogAction>
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