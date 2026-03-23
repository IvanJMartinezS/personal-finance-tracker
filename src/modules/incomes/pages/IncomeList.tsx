import { Card, CardContent } from "@/shared/components/ui/card";
import { useGetIncomes } from "../hooks/useGetIncomes";
import { useTranslation } from "react-i18next";
import { useIncomeFilters } from "../hooks/useIncomeFilters";
import { Filters } from "@/shared/components/Filters";
import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { useIncomeFilterConfigs } from "../hooks/useIncomeFilterConfig";
import { IncomesListHeader } from "../components/IncomesListHeader";
import { IncomesListSkeleton } from "../components/IncomesListSkeleton";
import { IncomeRow } from "../components/IncomeRow";
import type { Income } from "../utils/types";

export const IncomeList = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);

  const { data: categories, isLoading: categoriesLoading } = useGetCategories("income");
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes();

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

  const filterConfigs = useIncomeFilterConfigs(
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    categories ?? []
  );

  if (incomesLoading || categoriesLoading) {
    return <IncomesListSkeleton />;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <IncomesListHeader categories={categories ?? []} total={totalFiltered} count={filteredIncomes.length} />

      <Filters
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: i18nString("searchIncomes"),
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
