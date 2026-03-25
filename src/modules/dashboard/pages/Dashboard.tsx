import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatCOP, formatCurrency } from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMemo } from "react";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { useGetIncomes } from "@/modules/incomes/hooks/useGetIncomes";
import { useDashboardTotals } from "../hooks/useDashboardTotals";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";

// Load only the 10 most recent records for the dashboard list
const RECENT_LIMIT = 10;

export const Dashboard = () => {
  const i18nString = useModuleTranslation("dashboard");

  // Totals come from a lightweight query (only amount_in_base column)
  const { totalExpenses, totalIncome, balance, isLoading: totalsLoading } = useDashboardTotals();

  // Recent transactions limited to RECENT_LIMIT — not all records
  const { data: expenses, isLoading: expensesLoading } = useGetExpenses(RECENT_LIMIT);
  const { data: incomes, isLoading: incomesLoading } = useGetIncomes(RECENT_LIMIT);

  const categoryExpenseData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    (expenses ?? []).forEach(e => {
      const cat = e.categories as any;
      const key = cat?.name ?? "Sin categoría";
      const existing = map.get(key);
      if (existing) existing.value += Number(e.amount_in_base);
      else map.set(key, { name: key, value: Number(e.amount_in_base), color: cat?.color ?? "#888" });
    });
    return Array.from(map.values());
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    const all = [
      ...(expenses ?? []).map(e => ({ ...e, _type: "expense" as const, _label: e.item, _cat: e.categories as any })),
      ...(incomes ?? []).map(i => ({ ...i, _type: "income" as const, _label: i.source, _cat: i.categories as any })),
    ];
    return all.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [expenses, incomes]);

  if (expensesLoading || incomesLoading || totalsLoading) {
    return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28" />)}</div><Skeleton className="h-80" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i18nString('totalIncome')}</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10"><TrendingUp className="h-4 w-4 text-success" /></div>
          </div>
          <p className="mt-2 text-2xl font-bold money-font text-success">{formatCOP(totalIncome)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i18nString('totalExpenses')}</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10"><TrendingDown className="h-4 w-4 text-destructive" /></div>
          </div>
          <p className="mt-2 text-2xl font-bold money-font text-destructive">{formatCOP(totalExpenses)}</p>
        </div>
        <div className="stat-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{i18nString('balance')}</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Wallet className="h-4 w-4 text-primary" /></div>
          </div>
          <p className={`mt-2 text-2xl font-bold money-font ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCOP(balance)}</p>
        </div>
      </div>

      {categoryExpenseData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{i18nString('expensesPerCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryExpenseData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryExpenseData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCOP(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {categoryExpenseData.map(cat => (
                <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground truncate">{cat.name}</span>
                  <span className="ml-auto money-font text-foreground">{formatCOP(cat.value)}</span>
                </div>
              ))}
            </div> 
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{i18nString('recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">{i18nString('noTransactions')}</p>
          ) : (
            <div className="divide-y divide-border">
              {recentTransactions.map(t => {
                const isExpense = t._type === "expense";
                return (
                  <div key={t.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: (t._cat?.color ?? '#888') + '20' }}>
                      {isExpense ? <TrendingDown className="h-4 w-4" style={{ color: t._cat?.color }} /> : <TrendingUp className="h-4 w-4" style={{ color: t._cat?.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t._label}</p>
                      <p className="text-xs text-muted-foreground">
                        {t._cat?.name ?? "Sin categoría"} · {new Date(t.date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold money-font ${isExpense ? 'text-destructive' : 'text-success'}`}>
                      {isExpense ? '-' : '+'}{formatCurrency(Number(t.amount), t.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
