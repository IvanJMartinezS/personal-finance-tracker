import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";
import { getBudgetStatusColor } from "../utils/calculateBudgetUsage";
import { useBudgetsUsage } from "../hooks/useBudgetsUsage";
import { useBudgetsHistory } from "../hooks/useBudgetsHistory";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";

const STATUS_BAR_CLASS = {
  green: "bg-success",
  orange: "bg-warning",
  red: "bg-destructive",
} as const;

const STATUS_TEXT_CLASS = {
  green: "text-success",
  orange: "text-warning",
  red: "text-destructive",
} as const;

export const DashboardBudgetsCard = () => {
  const i18nString = useModuleTranslation("budgets");
  const navigate = useNavigate();
  const now = new Date();
  const { data: budgetsUsage, isLoading } = useBudgetsUsage(now.getFullYear(), now.getMonth() + 1);

  // El acumulado del año (misma cifra que la columna "Acumulado" del
  // historial en la página de Presupuesto) — a diferencia de lo de arriba,
  // que es solo del mes actual, esto neta todos los meses del año.
  const { data: budgetsHistory } = useBudgetsHistory(now.getFullYear());
  const accumulatedByBudgetId = useMemo(() => {
    const map = new Map<string, number>();
    for (const { budget, entries } of budgetsHistory) {
      if (entries.length > 0) map.set(budget.id, entries[entries.length - 1].accumulatedUSD);
    }
    return map;
  }, [budgetsHistory]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{i18nString("monthlyBudget")}</CardTitle>
        {budgetsUsage.length > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate("/budgets")}>
            {i18nString("viewAll")}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : budgetsUsage.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <PiggyBank className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{i18nString("noBudgetsYet")}</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/budgets")}>
              {i18nString("setUpBudget")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {budgetsUsage.map(({ budget, spentUSD, remainingUSD, percentUsed, percentAvailable }) => {
              const status = getBudgetStatusColor(percentAvailable);
              const cat = budget.categories;
              const accumulatedUSD = accumulatedByBudgetId.get(budget.id);
              return (
                <div key={budget.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 font-medium truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? "#888" }} />
                      {cat?.name ?? i18nString("uncategorized")}
                    </span>
                    <span className="text-muted-foreground shrink-0 money-font">
                      {i18nString("spentOfBudget", {
                        spent: formatCurrency(spentUSD, "USD"),
                        budget: formatCurrency(budget.amount_usd, "USD"),
                      })}
                    </span>
                  </div>
                  <Progress value={Math.min(percentUsed, 100)} indicatorClassName={STATUS_BAR_CLASS[status]} />
                  <p className={`text-[11px] money-font ${STATUS_TEXT_CLASS[status]}`}>
                    {remainingUSD >= 0
                      ? i18nString("remainingShort", { amount: formatCurrency(remainingUSD, "USD") })
                      : i18nString("overBudgetShort", { amount: formatCurrency(Math.abs(remainingUSD), "USD") })}
                    {accumulatedUSD !== undefined && (
                      <>
                        {" · "}
                        {accumulatedUSD >= 0
                          ? i18nString("accumulatedSavings", { amount: formatCurrency(accumulatedUSD, "USD") })
                          : i18nString("accumulatedDeficit", { amount: formatCurrency(Math.abs(accumulatedUSD), "USD") })}
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
