import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useBudgetsUsage } from "../hooks/useBudgetsUsage";
import { formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CategoryBudgetSummaryProps {
  categoryId: string;
  year: number;
  month: number;
}

/**
 * Resumen "gastado de presupuestado" de UNA categoría en UN mes puntual —
 * usado en Gastos cuando el usuario filtra por categoría + mes + año, para
 * que vea el presupuesto de esa categoría sin tener que ir al Dashboard o a
 * Presupuesto. No muestra nada si esa categoría no tiene presupuesto
 * asignado.
 */
export const CategoryBudgetSummary = ({ categoryId, year, month }: CategoryBudgetSummaryProps) => {
  const i18nString = useModuleTranslation("budgets");
  const { data: budgetsUsage } = useBudgetsUsage(year, month);
  const usage = budgetsUsage.find((u) => u.budget.category_id === categoryId);
  if (!usage) return null;

  const isExceeded = usage.remainingUSD < 0;
  const cat = usage.budget.categories;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm">
      <span className="flex items-center gap-1.5 font-medium">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? "#888" }} />
        <span style={{ color: cat?.color }}>{cat?.name ?? i18nString("uncategorized")}</span>
      </span>
      <span className="text-muted-foreground money-font">
        {i18nString("spentOfBudget", {
          spent: formatCurrency(usage.spentUSD, "USD"),
          budget: formatCurrency(usage.budget.amount_usd, "USD"),
        })}
      </span>
      <span className={cn("font-semibold money-font", isExceeded ? "text-destructive" : "text-success")}>
        {isExceeded
          ? i18nString("overBudgetShort", { amount: formatCurrency(Math.abs(usage.remainingUSD), "USD") })
          : i18nString("remainingShort", { amount: formatCurrency(usage.remainingUSD, "USD") })}
      </span>
    </div>
  );
};
