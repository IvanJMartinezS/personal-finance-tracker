import { useMemo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useTranslation } from "react-i18next";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useListFilters } from "@/shared/hooks/useListFilters";
import { useListFilterConfigs } from "@/shared/hooks/useListFilterConfigs";
import { toCopEquivalent } from "@/lib/mock-data";
import type { Expense } from "@/types";
import { ExpenseRow } from "../components/ExpenseRow";
import { ExpensesListSkeleton } from "../components/ExpensesListSkeleton";
import { ExpensesListHeader } from "../components/ExpensesListHeader";
import { CreateExpenseDialog } from "./CreateExpenseDialog";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { DeleteExpenseButton } from "./DeleteExpenseButton";
import { useLocation } from "react-router-dom";

export const ExpensesList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);
  const location = useLocation();

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("expense");
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();

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
    totalFiltered,
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

  // Suma el equivalente en COP de cada gasto filtrado (exacto donde se dio
  // una tasa al registrarlo, estimado donde no) — no convierte el total en
  // USD de una sola vez, para no perder esa precisión por transacción.
  const totalFilteredCOP = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + toCopEquivalent(e), 0),
    [filteredExpenses]
  );

  if (expensesLoading || categoriesLoading) return <ExpensesListSkeleton />;

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        <ExpensesListHeader total={totalFiltered} totalCOP={totalFilteredCOP} count={filteredExpenses.length} />
        <Filters
          search={{ value: searchQuery, onChange: setSearchQuery, placeholder: i18nString('searchExpenses') }}
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

      {isCreateDialog && <CreateExpenseDialog />}
      {isEditDialog && <EditExpenseDialog />}
      {isDeleteDialog && <DeleteExpenseButton />}
    </>
  );
};
