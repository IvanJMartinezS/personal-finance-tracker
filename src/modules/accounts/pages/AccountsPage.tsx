import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useAccountsSummary } from "../hooks/useAccountsSummary";
import { useYearFilter } from "@/shared/hooks/useYearFilter";
import { useGetBudgets } from "@/modules/budgets/hooks/useGetBudgets";
import { sumBudgetsUSD } from "@/modules/budgets/utils/sumBudgetsUSD";
import { formatCurrency } from "@/lib/mock-data";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { YearFilter } from "@/shared/components/YearFilter";
import { Plus } from "lucide-react";
import { AccountsSummaryCards } from "../components/AccountsSummaryCards";
import { AccountsByCurrencySection } from "../components/AccountsByCurrencySection";
import { BudgetSummaryCard } from "../components/BudgetSummaryCard";
import { MonthlyHistoryTable } from "../components/MonthlyHistoryTable";

export const AccountsPage = () => {
  const i18nString = useModuleTranslation("accounts");
  const navigate = useNavigate();
  const location = useLocation();

  const { year, years, setYear } = useYearFilter();
  const { currentMonth, accounts, snapshotMap, currentTotals, monthlyTotals, grouped, isLoading } = useAccountsSummary(year);
  const { data: budgets, isLoading: budgetsLoading } = useGetBudgets();
  const budgetTotalUSD = useMemo(() => sumBudgetsUSD(budgets), [budgets]);

  // Historial mensual, pero mostrando lo disponible por fuera del presupuesto
  // (total de cuentas de ese mes − presupuesto configurado), no el total
  // crudo. `null` = todavía no hay ningún saldo registrado ese mes (se
  // muestra "—"); no se confunde con un disponible que dio negativo de verdad.
  const availableMonthlyTotals = useMemo(
    () => monthlyTotals.map(({ month, totalUSD }) => ({
      month,
      totalUSD: totalUSD === 0 ? null : totalUSD - budgetTotalUSD,
    })),
    [monthlyTotals, budgetTotalUSD]
  );

  if (isLoading || budgetsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleAddAccount = () => navigate("create", { state: { backgroundLocation: location } });
  const handleDeleteAccount = (id: string) => navigate(`delete/${id}`, { state: { backgroundLocation: location } });
  const handleRegisterBalance = (accountId: string) => navigate(`snapshot/${accountId}`, { state: { backgroundLocation: location, year } });
  const handleViewAccount = (accountId: string) => navigate(`view/${accountId}`, { state: { backgroundLocation: location, year } });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {i18nString("subtitle")} · {new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <YearFilter year={year} years={years} onChange={setYear} />
          <Button className="gap-2" onClick={handleAddAccount}>
            <Plus className="h-4 w-4" />
            {i18nString("newAccount")}
          </Button>
        </div>
      </div>

      <AccountsSummaryCards
        usd={currentTotals.usd}
        cop={currentTotals.cop}
        copUSD={currentTotals.copUSD}
        totalUSD={currentTotals.totalUSD}
        totalUSDLabel={i18nString("totalUSD")}
      />

      {(["USD", "COP", "VES"] as const).map((cur) => (
        <AccountsByCurrencySection
          key={cur}
          currency={cur}
          accounts={grouped[cur]}
          snapshotForAccount={(accountId) => snapshotMap[accountId]?.[currentMonth]}
          noBalanceLabel={i18nString("noBalance")}
          registerBalanceLabel={i18nString("registerBalance")}
          viewDetailLabel={i18nString("viewDetail")}
          typeLabel={(type) => i18nString(`type_${type}`)}
          onRegisterBalance={handleRegisterBalance}
          onDeleteAccount={handleDeleteAccount}
          onViewAccount={handleViewAccount}
        />
      ))}

      <BudgetSummaryCard
        totalUSD={budgetTotalUSD}
        label={i18nString("budgetLabel")}
        subtitle={i18nString("budgetSummarySubtitle")}
      />

      <MonthlyHistoryTable
        year={year}
        currentMonth={currentMonth}
        monthlyTotals={availableMonthlyTotals}
        title={i18nString("monthlyHistory")}
        monthLabel={i18nString("month")}
        totalUSDLabel={i18nString("availableUSD")}
        diffLabel={i18nString("diff")}
        note={budgetTotalUSD > 0 ? i18nString("availableUSDNote", { amount: formatCurrency(budgetTotalUSD, "USD") }) : undefined}
      />

      {accounts.length === 0 && (
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
