import { Page, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { PdfFooter } from "./PdfFooter";
import { CategoryTotalsTable } from "./CategoryTotalsTable";
import type { CategoryTotal } from "../hooks/useAnnualReportData";

interface CategoriesPageProps {
  year: number;
  generatedAtLabel: string;
  expenseCategoryTotals: CategoryTotal[];
  incomeCategoryTotals: CategoryTotal[];
  totalExpenseUSD: number;
  totalExpenseCOP: number;
  totalIncomeUSD: number;
  totalIncomeCOP: number;
}

export const CategoriesPage = ({
  year,
  generatedAtLabel,
  expenseCategoryTotals,
  incomeCategoryTotals,
  totalExpenseUSD,
  totalExpenseCOP,
  totalIncomeUSD,
  totalIncomeCOP,
}: CategoriesPageProps) => (
  <Page size="A4" style={pdfStyles.page}>
    <PdfHeader title="Gastos e ingresos por categoría" subtitle={`Totales del año ${year}`} />

    <Text style={pdfStyles.sectionTitle}>Gastos por categoría</Text>
    <CategoryTotalsTable
      categories={expenseCategoryTotals}
      totalUSD={totalExpenseUSD}
      totalCOP={totalExpenseCOP}
      emptyLabel="No hay gastos registrados este año."
    />

    <Text style={pdfStyles.sectionTitle}>Ingresos por categoría</Text>
    <CategoryTotalsTable
      categories={incomeCategoryTotals}
      totalUSD={totalIncomeUSD}
      totalCOP={totalIncomeCOP}
      emptyLabel="No hay ingresos registrados este año."
    />

    <PdfFooter generatedAtLabel={generatedAtLabel} />
  </Page>
);
