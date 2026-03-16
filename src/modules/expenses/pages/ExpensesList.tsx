import { Card, CardContent } from "@/shared/components/ui/card";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useTranslation } from "react-i18next";
import { useExpenseFilters } from "@/modules/expenses/hooks/useExpenseFilters";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import type { Expense } from "../utils/types"; 
import { CreateExpenseDialog } from "./CreateExpenseDialog";
import { ExpenseRow } from "../components/ExpenseRow";
import { ExpensesListSkeleton } from "../components/ExpensesListSkeleton";
import { useExpenseFilterConfigs } from "../hooks/useExpenseFilterConfig";
import { formatCOP } from "@/lib/mock-data";

export const ExpensesList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense");
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();

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

  const filterConfigs = useExpenseFilterConfigs(
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    categories ?? []
  );

  if (expensesLoading || categoriesLoading) {
    return <ExpensesListSkeleton />;
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

        <CreateExpenseDialog
          categories={categories ?? []} 
        />
        
      </div>

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
              {filteredExpenses.map((expense: Expense) => (
                <ExpenseRow key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};