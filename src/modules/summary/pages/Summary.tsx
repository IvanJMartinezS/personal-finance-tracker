import { useMemo } from "react";
import { useYearlySummary } from "../hooks/useYearlySummary";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCOP } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const YEAR = 2026;
const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const currentMonth = new Date().getFullYear() === YEAR
  ? new Date().getMonth() + 1
  : 12;

function fmtUSD(val: number) {
  return val === 0 ? "—" : `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtCOP(val: number) {
  return val === 0 ? "—" : formatCOP(val);
}

export const Summary = () => {
  const { data, isLoading } = useYearlySummary();

  const visibleMonths = useMemo(
    () => Array.from({ length: currentMonth }, (_, i) => i + 1),
    []
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Resumen {YEAR}</h1>
        <p className="text-sm text-muted-foreground">
          Gastos por categoría · {currentMonth} {currentMonth === 1 ? "mes" : "meses"} registrados
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {/* Category column */}
              <th className="sticky left-0 z-10 bg-muted/80 backdrop-blur-sm text-left px-4 py-3 font-semibold text-foreground min-w-[140px] border-r border-border">
                Categoría
              </th>
              {/* Month columns — 2 per month (COP + USD) */}
              {visibleMonths.map((m) => (
                <th
                  key={m}
                  colSpan={2}
                  className={cn(
                    "text-center px-2 py-3 font-semibold border-r border-border",
                    m === currentMonth
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  )}
                >
                  {MONTHS[m - 1]}
                </th>
              ))}
            </tr>
            {/* Sub-header: COP / USD per month */}
            <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
              <th className="sticky left-0 z-10 bg-muted/60 backdrop-blur-sm px-4 py-1.5 border-r border-border" />
              {visibleMonths.map((m) => (
                <>
                  <th key={`${m}-cop`} className="px-3 py-1.5 text-right font-medium">COP</th>
                  <th key={`${m}-usd`} className="px-3 py-1.5 text-right font-medium border-r border-border">USD</th>
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
                  No hay categorías de gastos registradas
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={cat.id}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/30 transition-colors",
                      isEven ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    {/* Category name with color dot */}
                    <td className="sticky left-0 z-10 backdrop-blur-sm px-4 py-3 border-r border-border font-medium"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span style={{ color: cat.color }}>{cat.name}</span>
                      </div>
                    </td>

                    {/* Data per month */}
                    {visibleMonths.map((m) => {
                      const cell = months[m]?.byCategory[cat.id];
                      const cop = cell?.amountCOP ?? 0;
                      const usd = cell?.amountUSD ?? 0;
                      const isCurrentMonth = m === currentMonth;

                      return (
                        <>
                          <td
                            key={`${cat.id}-${m}-cop`}
                            className={cn(
                              "px-3 py-3 text-right tabular-nums",
                              isCurrentMonth && "bg-primary/5",
                              cop > 0 ? "text-foreground" : "text-muted-foreground/40"
                            )}
                          >
                            {fmtCOP(cop)}
                          </td>
                          <td
                            key={`${cat.id}-${m}-usd`}
                            className={cn(
                              "px-3 py-3 text-right tabular-nums border-r border-border/50",
                              isCurrentMonth && "bg-primary/5",
                              usd > 0 ? "text-muted-foreground" : "text-muted-foreground/40"
                            )}
                          >
                            {fmtUSD(usd)}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                );
              })
            )}

            {/* Totals row */}
            <tr className="border-t-2 border-border bg-muted/50 font-semibold">
              <td className="sticky left-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-3 border-r border-border text-foreground">
                Total
              </td>
              {visibleMonths.map((m) => {
                const ms = months[m];
                const totalCOP = ms?.totalCOP ?? 0;
                const totalUSD = ms?.totalUSD ?? 0;
                const isCurrentMonth = m === currentMonth;

                return (
                  <>
                    <td
                      key={`total-${m}-cop`}
                      className={cn(
                        "px-3 py-3 text-right tabular-nums text-destructive",
                        isCurrentMonth && "bg-primary/10"
                      )}
                    >
                      {fmtCOP(totalCOP)}
                    </td>
                    <td
                      key={`total-${m}-usd`}
                      className={cn(
                        "px-3 py-3 text-right tabular-nums text-destructive/80 border-r border-border",
                        isCurrentMonth && "bg-primary/10"
                      )}
                    >
                      {fmtUSD(totalUSD)}
                    </td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        * Los valores en USD se calculan usando la tasa de cambio registrada en cada gasto. Los gastos en COP se convierten usando una tasa referencial de $3.700.
      </p>
    </div>
  );
};
