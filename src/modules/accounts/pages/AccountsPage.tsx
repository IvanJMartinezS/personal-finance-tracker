import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { useGetSnapshots } from "../hooks/useGetSnapshots";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Trash2, PencilLine } from "lucide-react";
import { formatCOP } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Account, AccountSnapshot } from "../utils/types";

const YEAR = 2026;
const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const REF_RATE = 3700; // COP → USD reference rate

const currentMonth = new Date().getFullYear() === YEAR
  ? new Date().getMonth() + 1
  : 12;

function toUSD(amount: number, currency: string, rate = REF_RATE): number {
  if (currency === "USD") return amount;
  if (currency === "COP") return amount / rate;
  return 0; // VES — no reliable conversion without stored rate
}

function fmtUSD(val: number) {
  return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const AccountsPage = () => {
  const i18nString = useModuleTranslation("accounts");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: accounts, isLoading: loadingAccounts } = useGetAccounts();
  const { data: snapshots, isLoading: loadingSnapshots } = useGetSnapshots(YEAR);

  // Build lookup: accountId → month → snapshot
  const snapshotMap = useMemo(() => {
    const map: Record<string, Record<number, AccountSnapshot>> = {};
    for (const s of snapshots ?? []) {
      if (!map[s.account_id]) map[s.account_id] = {};
      map[s.account_id][s.month] = s;
    }
    return map;
  }, [snapshots]);

  // Current month totals per currency
  const currentTotals = useMemo(() => {
    let usd = 0, cop = 0, ves = 0;
    for (const acc of accounts ?? []) {
      const snap = snapshotMap[acc.id]?.[currentMonth];
      if (!snap) continue;
      if (acc.currency === "USD") usd += snap.amount;
      else if (acc.currency === "COP") cop += snap.amount;
      else ves += snap.amount;
    }
    return { usd, cop, ves, totalUSD: usd + cop / REF_RATE };
  }, [accounts, snapshotMap]);

  // Monthly totals in USD for the history table
  const monthlyTotals = useMemo(() => {
    return Array.from({ length: currentMonth }, (_, i) => {
      const m = i + 1;
      let total = 0;
      for (const acc of accounts ?? []) {
        const snap = snapshotMap[acc.id]?.[m];
        if (snap) total += toUSD(snap.amount, acc.currency);
      }
      return { month: m, totalUSD: total };
    });
  }, [accounts, snapshotMap]);

  // Group accounts by currency for display
  const grouped = useMemo(() => {
    const g: Record<string, Account[]> = { USD: [], COP: [], VES: [] };
    for (const acc of accounts ?? []) {
      g[acc.currency]?.push(acc);
    }
    return g;
  }, [accounts]);

  const isLoading = loadingAccounts || loadingSnapshots;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleAddAccount = () => navigate("create", { state: { backgroundLocation: location } });
  const handleDeleteAccount = (id: string) => navigate(`delete/${id}`, { state: { backgroundLocation: location } });
  const handleRegisterBalance = (accountId: string) => navigate(`snapshot/${accountId}`, { state: { backgroundLocation: location } });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {i18nString("subtitle")} · {new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddAccount}>
          <Plus className="h-4 w-4" />
          {i18nString("newAccount")}
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">USD</p>
            <p className="text-2xl font-bold money-font text-success">{fmtUSD(currentTotals.usd)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">COP</p>
            <p className="text-2xl font-bold money-font">{formatCOP(currentTotals.cop)}</p>
            <p className="text-xs text-muted-foreground">{fmtUSD(currentTotals.cop / REF_RATE)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">{i18nString("totalUSD")}</p>
            <p className="text-2xl font-bold money-font text-primary">{fmtUSD(currentTotals.totalUSD)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts by currency */}
      {(["USD", "COP", "VES"] as const).map((cur) => {
        const accs = grouped[cur];
        if (!accs?.length) return null;
        return (
          <Card key={cur} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {cur}
                <Badge variant="secondary">{accs.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {accs.map((acc) => {
                  const snap = snapshotMap[acc.id]?.[currentMonth];
                  return (
                    <div key={acc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: acc.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: acc.color }}>{acc.name}</p>
                        <p className="text-xs text-muted-foreground">{i18nString(`type_${acc.type}`)}</p>
                      </div>
                      <div className="text-right mr-2">
                        {snap ? (
                          <>
                            <p className="text-sm font-semibold money-font">
                              {cur === "COP" ? formatCOP(snap.amount) : `${snap.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${cur}`}
                            </p>
                            {cur !== "USD" && cur !== "VES" && (
                              <p className="text-xs text-muted-foreground">{fmtUSD(toUSD(snap.amount, cur))}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">{i18nString("noBalance")}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRegisterBalance(acc.id)}
                        title={i18nString("registerBalance")}
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAccount(acc.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Monthly history table */}
      {monthlyTotals.length > 1 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{i18nString("monthlyHistory")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">{i18nString("month")}</th>
                    <th className="px-4 py-2 text-right font-medium">{i18nString("totalUSD")}</th>
                    <th className="px-4 py-2 text-right font-medium">{i18nString("diff")}</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTotals.map((row, idx) => {
                    const prev = idx > 0 ? monthlyTotals[idx - 1].totalUSD : null;
                    const diff = prev !== null ? row.totalUSD - prev : null;
                    const isCurrent = row.month === currentMonth;
                    return (
                      <tr
                        key={row.month}
                        className={cn(
                          "border-b border-border/50 hover:bg-muted/20 transition-colors",
                          isCurrent && "bg-primary/5 font-semibold"
                        )}
                      >
                        <td className="px-4 py-2.5">{MONTHS_SHORT[row.month - 1]} {YEAR}</td>
                        <td className="px-4 py-2.5 text-right money-font">
                          {row.totalUSD > 0 ? fmtUSD(row.totalUSD) : "—"}
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
        </Card>
      )}

      {accounts?.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-sm">{i18nString("noAccounts")}</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={handleAddAccount}>
            <Plus className="h-4 w-4" />
            {i18nString("newAccount")}
          </Button>
        </div>
      )}
    </div>
  );
};
