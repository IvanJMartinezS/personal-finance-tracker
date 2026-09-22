import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useYearlySummary } from "../hooks/useYearlySummary";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { YearFilter } from "@/shared/components/YearFilter";
import { useYearFilter } from "@/shared/hooks/useYearFilter";
import { formatCOP } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getElapsedMonthsInYear } from "@/lib/dateUtils";

const MONTH_KEYS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function fmtUSD(val: number) {
  return val === 0 ? "—" : `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtCOP(val: number) {
  return val === 0 ? "—" : formatCOP(val);
}

export const Summary = () => {
  const { t } = useTranslation();
  const i18nString = useModuleTranslation("summary");

  const { year, years, setYear } = useYearFilter();
  const { data, isLoading } = useYearlySummary(year);
  const currentMonth = getElapsedMonthsInYear(year);

  const visibleMonths = useMemo(
    () => Array.from({ length: currentMonth }, (_, i) => i + 1),
    [currentMonth]
  );

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const categories = data?.categories ?? [];
  const months = data?.months ?? {};

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title", { year })}</h1>
          <p className="text-sm text-muted-foreground">
            {i18nString("subtitle")} · {t("summary.monthsRegistered", { count: currentMonth })}
          </p>
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
                  <th key={`${m}-usd`} className="px-3 py-1.5 text-right font-medium">USD</th>
                  <th key={`${m}-cop`} className="px-3 py-1.5 text-right font-medium border-r border-border">COP</th>
                </>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={1 + visibleMonths.length * 2}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {i18nString("noCategories")}
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                  )}
                >
                  <td
                    className="sticky left-0 z-10 backdrop-blur-sm px-4 py-3 border-r border-border font-medium"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span style={{ color: cat.color }}>{cat.name}</span>
                    </div>
                  </td>

                  {visibleMonths.map((m) => {
                    const cell = months[m]?.byCategory[cat.id];
                    const cop = cell?.amountCOP ?? 0;
                    const usd = cell?.amountUSD ?? 0;
                    const isCurrentMonth = m === currentMonth;
                    return (
                      <>
                        <td
                          key={`${cat.id}-${m}-usd`}
                          className={cn(
                            "px-3 py-3 text-right tabular-nums",
                            isCurrentMonth && "bg-primary/5",
                            usd > 0 ? "text-foreground" : "text-muted-foreground/40"
                          )}
                        >
                          {fmtUSD(usd)}
                        </td>
                        <td
                          key={`${cat.id}-${m}-cop`}
                          className={cn(
                            "px-3 py-3 text-right tabular-nums border-r border-border/50",
                            isCurrentMonth && "bg-primary/5",
                            cop > 0 ? "text-muted-foreground" : "text-muted-foreground/40"
                          )}
                        >
                          {fmtCOP(cop)}
                        </td>
                      </>
                    );
                  })}
                </tr>
              ))
            )}

            <tr className="border-t-2 border-border bg-muted/50 font-semibold">
              <td className="sticky left-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-3 border-r border-border text-foreground">
                {i18nString("total")}
              </td>
              {visibleMonths.map((m) => {
                const ms = months[m];
                const isCurrentMonth = m === currentMonth;
                return (
                  <>
                    <td
                      key={`total-${m}-usd`}
                      className={cn("px-3 py-3 text-right tabular-nums text-destructive", isCurrentMonth && "bg-primary/10")}
                    >
                      {fmtUSD(ms?.totalUSD ?? 0)}
                    </td>
                    <td
                      key={`total-${m}-cop`}
                      className={cn("px-3 py-3 text-right tabular-nums text-destructive/80 border-r border-border", isCurrentMonth && "bg-primary/10")}
                    >
                      {fmtCOP(ms?.totalCOP ?? 0)}
                    </td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{i18nString("usdNote")}</p>
    </div>
  );
};
