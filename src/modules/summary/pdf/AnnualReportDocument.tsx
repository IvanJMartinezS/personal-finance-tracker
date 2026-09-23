import { Document } from "@react-pdf/renderer";
import { CoverPage } from "./CoverPage";
import { CategoriesPage } from "./CategoriesPage";
import { MonthlyMatrixPage } from "./MonthlyMatrixPage";
import { BudgetPage } from "./BudgetPage";
import { AccountsPage } from "./AccountsPage";
import type { useAnnualReportData } from "../hooks/useAnnualReportData";

type AnnualReportData = ReturnType<typeof useAnnualReportData>;

interface AnnualReportDocumentProps {
  data: AnnualReportData;
}

export const AnnualReportDocument = ({ data }: AnnualReportDocumentProps) => {
  const generatedAtLabel = `Generado el ${data.generatedAt.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}`;

  return (
    <Document title={`Reporte financiero anual ${data.year}`} author="FinTrack">
      <CoverPage
        year={data.year}
        generatedAtLabel={generatedAtLabel}
        totals={data.totals}
        topExpenseCategories={data.expenseCategoryTotals}
      />
      <CategoriesPage
        year={data.year}
        generatedAtLabel={generatedAtLabel}
        expenseCategoryTotals={data.expenseCategoryTotals}
        incomeCategoryTotals={data.incomeCategoryTotals}
        totalExpenseUSD={data.totals.expenseUSD}
        totalExpenseCOP={data.totals.expenseCOP}
        totalIncomeUSD={data.totals.incomeUSD}
        totalIncomeCOP={data.totals.incomeCOP}
      />
      <MonthlyMatrixPage
        year={data.year}
        generatedAtLabel={generatedAtLabel}
        monthlySummary={data.monthlySummary}
        elapsedMonths={data.elapsedMonths}
      />
      <BudgetPage year={data.year} generatedAtLabel={generatedAtLabel} budgetsHistory={data.budgetsHistory} />
      <AccountsPage
        year={data.year}
        generatedAtLabel={generatedAtLabel}
        accounts={data.accounts}
        snapshotMap={data.accountSnapshotMap}
        currentMonth={data.accountCurrentMonth}
        totalUSD={data.accountCurrentTotals.totalUSD}
      />
    </Document>
  );
};
