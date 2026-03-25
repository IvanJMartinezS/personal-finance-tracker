import { Card, CardContent } from "@/shared/components/ui/card";
import { useGetIncomes } from "../hooks/useGetIncomes";
import { useTranslation } from "react-i18next";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useListFilters } from "@/shared/hooks/useListFilters";
import { useListFilterConfigs } from "@/shared/hooks/useListFilterConfigs";
import type { Income } from "@/types";
import { IncomesListHeader } from "../components/IncomesListHeader";
import { IncomesListSkeleton } from "../components/IncomesListSkeleton";
import { IncomeRow } from "../components/IncomeRow";

export const IncomeList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("income");
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();

  const {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    filteredItems: filteredIncomes,
    totalFiltered,
    clearFilters,
  } = useListFilters<Income>({
    items: incomes ?? [],
    searchFn: (i, q) => i.source.toLowerCase().includes(q.toLowerCase()),
    categoryFn: (i) => i.category_id,
    currencyFn: (i) => i.currency,
    dateFn: (i) => i.date,
    amountFn: (i) => Number(i.amount_in_base),
  });

  const filterConfigs = useListFilterConfigs({
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    categories: categories ?? [],
  });

  if (incomesLoading || categoriesLoading) return <IncomesListSkeleton />;

  return (
    <div className="space-y-5 animate-fade-in">
      <IncomesListHeader total={totalFiltered} count={filteredIncomes.length} />
      <Filters
        search={{ value: searchQuery, onChange: setSearchQuery, placeholder: i18nString("searchIncomes") }}
        filters={filterConfigs}
        onClearAll={clearFilters}
      />
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {filteredIncomes.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{i18nString("noRecords")}</p>
          ) : (
            <div className="divide-y divide-border">
              {filteredIncomes.map((income: Income) => (
                <IncomeRow key={income.id} income={income} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
