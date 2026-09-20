import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useAccountsSummary } from "../hooks/useAccountsSummary";
import { useYearFilter } from "@/shared/hooks/useYearFilter";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { YearFilter } from "@/shared/components/YearFilter";
import { Plus } from "lucide-react";
import { AccountsSummaryCards } from "../components/AccountsSummaryCards";
import { AccountsByCurrencySection } from "../components/AccountsByCurrencySection";
import { MonthlyHistoryTable } from "../components/MonthlyHistoryTable";

export const AccountsPage = () => {
  const i18nString = useModuleTranslation("accounts");
  const navigate = useNavigate();
  const location = useLocation();

  const { year, years, setYear } = useYearFilter();
  const { currentMonth, accounts, snapshotMap, currentTotals, monthlyTotals, grouped, isLoading } = useAccountsSummary(year);

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
  const handleRegisterBalance = (accountId: string) => navigate(`snapshot/${accountId}`, { state: { backgroundLocation: location, year } });

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
          typeLabel={(type) => i18nString(`type_${type}`)}
          onRegisterBalance={handleRegisterBalance}
          onDeleteAccount={handleDeleteAccount}
        />
      ))}

      <MonthlyHistoryTable
        year={year}
        currentMonth={currentMonth}
        monthlyTotals={monthlyTotals}
        title={i18nString("monthlyHistory")}
        monthLabel={i18nString("month")}
        totalUSDLabel={i18nString("totalUSD")}
        diffLabel={i18nString("diff")}
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
