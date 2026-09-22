import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { fmtUSD } from "../hooks/useAccountsSummary";

const MONTHS_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface MonthlyHistoryTableProps {
  year: number;
  currentMonth: number;
  /** `totalUSD: null` = sin datos ese mes (aún no hay ningún saldo registrado) → se muestra "—". */
  monthlyTotals: { month: number; totalUSD: number | null }[];
  title: string;
  monthLabel: string;
  totalUSDLabel: string;
  diffLabel: string;
  note?: string;
}

export const MonthlyHistoryTable = ({
  year,
  currentMonth,
  monthlyTotals,
  title,
  monthLabel,
  totalUSDLabel,
  diffLabel,
  note,
}: MonthlyHistoryTableProps) => {
  if (monthlyTotals.length <= 1) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">{monthLabel}</th>
                <th className="px-4 py-2 text-right font-medium">{totalUSDLabel}</th>
                <th className="px-4 py-2 text-right font-medium">{diffLabel}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTotals.map((row, idx) => {
                const prev = idx > 0 ? monthlyTotals[idx - 1].totalUSD : null;
                const diff = (prev !== null && row.totalUSD !== null) ? row.totalUSD - prev : null;
                const isCurrent = row.month === currentMonth;
                return (
                  <tr
                    key={row.month}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/20 transition-colors",
                      isCurrent && "bg-primary/5 font-semibold"
                    )}
                  >
                    <td className="px-4 py-2.5">{MONTHS_SHORT[row.month - 1]} {year}</td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right money-font",
                        row.totalUSD !== null && row.totalUSD < 0 && "text-destructive"
                      )}
                    >
                      {row.totalUSD === null ? "—" : fmtUSD(row.totalUSD)}
                    </td>
                    <td className={cn(
                      "px-4 py-2.5 text-right money-font",
                      diff === null ? "text-muted-foreground" :
                      diff >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {diff === null ? "—" : `${diff >= 0 ? "+" : ""}${fmtUSD(diff)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
      {note && <p className="px-4 pb-3 text-xs text-muted-foreground">{note}</p>}
    </Card>
  );
};
