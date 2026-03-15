import { TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CURRENCIES, formatCOP, formatCurrency, MONTHS } from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useCreateExpense } from "@/modules/expenses/hooks/useGetCreateExpense";
import { useTranslation } from "react-i18next";
import { useExpenseFilters } from "@/modules/expenses/hooks/useExpenseFilters";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import type { Category, Currency, Month, Expense } from "../utils/types"; 
import { CreateExpense } from "./CreateExpense";
import { DeleteExpense } from "./DeleteExpense";

export const ExpensesList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense");
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();

  const createExpense = useCreateExpense();
 

  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    filteredExpenses,
    totalFiltered,
    clearFilters,
  } = useExpenseFilters({ expenses: expenses ?? [], categories: categories ?? [] });

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

  if (expensesLoading || categoriesLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} {i18nString('resumen')}
            <span className="money-font text-destructive ml-1">{formatCOP(totalFiltered)}</span>
          </p>
        </div>

        <CreateExpense
          categories={categories ?? []} 
          createExpense={createExpense} 
        />
        
      </div>

      {/* Filtros */}
      <Filters
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: i18nString('searchExpenses'),
        }}
        filters={filterConfigs}
        onClearAll={clearFilters}
      />

      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{i18nString('noRecords')}</p>
          ) : (
            <div className="divide-y divide-border">
              {filteredExpenses.map((expense: Expense) => {  
                const cat = expense.categories; 
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
                    
                    <DeleteExpense id={expense.id}/>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};