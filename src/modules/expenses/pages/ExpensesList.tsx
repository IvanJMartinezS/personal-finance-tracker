import { useMemo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useTranslation } from "react-i18next";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useGetBudgets } from "@/modules/budgets/hooks/useGetBudgets";
import { useListFilters } from "@/shared/hooks/useListFilters";
import { useListFilterConfigs } from "@/shared/hooks/useListFilterConfigs";
import { toCopEquivalent } from "@/lib/mock-data";
import { calculateExpenseBudgetOverages } from "@/modules/budgets/utils/calculateExpenseBudgetOverages";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { Expense } from "@/types";
import { ExpenseRow } from "../components/ExpenseRow";
import { ExpensesListSkeleton } from "../components/ExpensesListSkeleton";
import { ExpensesListHeader } from "../components/ExpensesListHeader";
import { CreateExpenseDialog } from "./CreateExpenseDialog";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { DeleteExpenseButton } from "./DeleteExpenseButton";
import { useLocation, useSearchParams } from "react-router-dom";

export const ExpensesList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const overBudgetOnly = searchParams.get('overBudget') === 'true';

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense");
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();
  const { data: budgets } = useGetBudgets();

  // Verificar si estamos en una ruta de diálogo
  const isCreateDialog = location.pathname.includes("/create");
  const isEditDialog = location.pathname.includes("/edit/");
  const isDeleteDialog = location.pathname.includes("/delete/");

  const {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    filteredItems: filteredExpenses,
    clearFilters,
  } = useListFilters<Expense>({
    items: expenses ?? [],
    searchFn: (e, q) => e.item.toLowerCase().includes(q.toLowerCase()),
    categoryFn: (e) => e.category_id,
    currencyFn: (e) => e.currency,
    dateFn: (e) => e.date,
    amountFn: (e) => Number(e.amount_in_base),
  });

  const filterConfigs = useListFilterConfigs({
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    categories: categories ?? [],
  });

  // Qué gastos hicieron que su categoría superara el presupuesto ese mes, y
  // por cuánto — se calcula sobre TODOS los gastos (no los ya filtrados),
  // porque el cálculo necesita la secuencia completa de cada categoría/mes.
  const overages = useMemo(
    () => calculateExpenseBudgetOverages(expenses ?? [], budgets),
    [expenses, budgets]
  );

  const overBudgetCount = useMemo(
    () => filteredExpenses.filter((e) => overages.has(e.id)).length,
    [filteredExpenses, overages]
  );

  const displayedExpenses = useMemo(
    () => (overBudgetOnly ? filteredExpenses.filter((e) => overages.has(e.id)) : filteredExpenses),
    [filteredExpenses, overBudgetOnly, overages]
  );

  const displayedTotalUSD = useMemo(
    () => displayedExpenses.reduce((sum, e) => sum + Number(e.amount_in_base), 0),
    [displayedExpenses]
  );
  const displayedTotalCOP = useMemo(
    () => displayedExpenses.reduce((sum, e) => sum + (toCopEquivalent(e) ?? 0), 0),
    [displayedExpenses]
  );

  const toggleOverBudgetOnly = () => {
    setSearchParams((prev) => {
      if (overBudgetOnly) prev.delete('overBudget');
      else prev.set('overBudget', 'true');
      return prev;
    });
  };

  if (expensesLoading || categoriesLoading) return <ExpensesListSkeleton />;

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        <ExpensesListHeader total={displayedTotalUSD} totalCOP={displayedTotalCOP} count={displayedExpenses.length} />
        <div className="flex flex-wrap items-center gap-2">
          <Filters
            search={{ value: searchQuery, onChange: setSearchQuery, placeholder: i18nString('searchExpenses') }}
            filters={filterConfigs}
            onClearAll={clearFilters}
          />
          {overBudgetCount > 0 && (
            <Button
              variant={overBudgetOnly ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={toggleOverBudgetOnly}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {i18nString("overBudgetFilterLabel")}
              <Badge variant={overBudgetOnly ? "secondary" : "outline"} className="ml-0.5">{overBudgetCount}</Badge>
            </Button>
          )}
        </div>
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {displayedExpenses.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">{i18nString('noRecords')}</p>
            ) : (
              <div className="divide-y divide-border">
                {displayedExpenses.map((expense: Expense) => (
                  <ExpenseRow key={expense.id} expense={expense} overage={overages.get(expense.id)} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isCreateDialog && <CreateExpenseDialog />}
      {isEditDialog && <EditExpenseDialog />}
      {isDeleteDialog && <DeleteExpenseButton />}
    </>
  );
};
