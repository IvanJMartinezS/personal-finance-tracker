import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useYearFilter } from "@/shared/hooks/useYearFilter";
import { YearFilter } from "@/shared/components/YearFilter";
import { useBudgetsHistory } from "../hooks/useBudgetsHistory";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/lib/mock-data";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

const MONTH_KEYS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function fmtUsdOrDash(val: number | undefined) {
  return val === undefined ? "—" : formatCurrency(val, "USD");
}

export const BudgetsHistorySection = () => {
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("budgets");
  const { year, years, setYear } = useYearFilter();
  const { data, isLoading } = useBudgetsHistory(year);
  const currentMonth = getElapsedMonthsInYear(year);
  const visibleMonths = useMemo(
    () => Array.from({ length: currentMonth }, (_, i) => i + 1),
    [currentMonth]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Sin presupuestos configurados no hay nada que mostrar en el historial —
  // el estado vacío de la lista de presupuestos, más arriba, ya lo explica.
  if (data.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">{i18nString("historyTitle")}</h2>
          <p className="text-sm text-muted-foreground">{i18nString("historySubtitle", { year })}</p>
        </div>
        <YearFilter year={year} years={years} onChange={setYear} />
      </div>

      <div className="rounded-lg border border-border/50 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="sticky left-0 z-10 bg-muted/80 backdrop-blur-sm text-left px-4 py-3 font-semibold text-foreground min-w-[140px] border-r border-border">
                {i18nString("category")}
              </th>
              {visibleMonths.map((m) => (
                <th
                  key={m}
                  colSpan={2}
                  className={cn(
                    "text-center px-2 py-3 font-semibold border-r border-border",
                    m === currentMonth ? "bg-primary/10 text-primary" : "text-foreground"
                  )}
                >
                  {t(`months.${MONTH_KEYS[m - 1]}`)}
                </th>
              ))}
            </tr>
            <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
              <th className="sticky left-0 z-10 bg-muted/60 backdrop-blur-sm px-4 py-1.5 border-r border-border" />
              {visibleMonths.map((m) => (
                <>
                  <th key={`${m}-avail`} className="px-3 py-1.5 text-right font-medium">
                    {i18nString("historyAvailable")}
                  </th>
                  <th key={`${m}-accum`} className="px-3 py-1.5 text-right font-medium border-r border-border">
                    {i18nString("historyAccumulated")}
                  </th>
                </>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map(({ budget, entries }, idx) => {
              const cat = budget.categories;
              const byMonth = new Map(entries.map((e) => [e.month, e]));
              return (
                <tr
                  key={budget.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                  )}
                >
                  <td
                    className="sticky left-0 z-10 backdrop-blur-sm px-4 py-3 border-r border-border font-medium"
                    style={{ backgroundColor: `${cat?.color ?? "#888"}15` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? "#888" }} />
                      <span style={{ color: cat?.color }}>{cat?.name ?? i18nString("uncategorized")}</span>
                    </div>
                  </td>

                  {visibleMonths.map((m) => {
                    const entry = byMonth.get(m);
                    const isCurrentMonth = m === currentMonth;
                    return (
                      <>
                        <td
                          key={`${budget.id}-${m}-avail`}
                          className={cn(
                            "px-3 py-3 text-right tabular-nums money-font",
                            isCurrentMonth && "bg-primary/5",
                            entry === undefined ? "text-muted-foreground/40" : entry.remainingUSD < 0 ? "text-destructive" : "text-foreground"
                          )}
                        >
                          {fmtUsdOrDash(entry?.remainingUSD)}
                        </td>
                        <td
                          key={`${budget.id}-${m}-accum`}
                          className={cn(
                            "px-3 py-3 text-right tabular-nums money-font font-medium border-r border-border/50",
                            isCurrentMonth && "bg-primary/5",
                            entry === undefined ? "text-muted-foreground/40" : entry.accumulatedUSD < 0 ? "text-destructive" : "text-success"
                          )}
                        >
                          {fmtUsdOrDash(entry?.accumulatedUSD)}
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{i18nString("historyNote")}</p>
    </div>
  );
};
