import { Page, Text, View } from "@react-pdf/renderer";
import { formatCOP, formatCurrency } from "@/lib/mock-data";
import { pdfStyles, pdfColors } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { PdfFooter } from "./PdfFooter";
import type { CategoryTotal } from "../hooks/useAnnualReportData";

interface CoverPageProps {
  year: number;
  generatedAtLabel: string;
  totals: { incomeUSD: number; incomeCOP: number; expenseUSD: number; expenseCOP: number; balanceUSD: number; balanceCOP: number };
  topExpenseCategories: CategoryTotal[];
}

export const CoverPage = ({ year, generatedAtLabel, totals, topExpenseCategories }: CoverPageProps) => (
  <Page size="A4" style={pdfStyles.page}>
    <PdfHeader title={`Reporte financiero anual — ${year}`} subtitle="Resumen general de ingresos, gastos y balance" />

    <View style={pdfStyles.kpiRow}>
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Ingresos</Text>
        <Text style={[pdfStyles.kpiValueUSD, { color: pdfColors.success }]}>{formatCurrency(totals.incomeUSD, "USD")}</Text>
        <Text style={pdfStyles.kpiValueCOP}>{formatCOP(totals.incomeCOP)}</Text>
      </View>
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Gastos</Text>
        <Text style={[pdfStyles.kpiValueUSD, { color: pdfColors.destructive }]}>{formatCurrency(totals.expenseUSD, "USD")}</Text>
        <Text style={pdfStyles.kpiValueCOP}>{formatCOP(totals.expenseCOP)}</Text>
      </View>
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Balance</Text>
        <Text style={[pdfStyles.kpiValueUSD, { color: totals.balanceUSD >= 0 ? pdfColors.success : pdfColors.destructive }]}>
          {formatCurrency(totals.balanceUSD, "USD")}
        </Text>
        <Text style={pdfStyles.kpiValueCOP}>{formatCOP(totals.balanceCOP)}</Text>
      </View>
    </View>

    {topExpenseCategories.length > 0 && (
      <>
        <Text style={pdfStyles.sectionTitle}>Principales categorías de gasto</Text>
        <View style={pdfStyles.table}>
          {topExpenseCategories.slice(0, 8).map((cat, idx) => {
            const percent = totals.expenseUSD > 0 ? (cat.usd / totals.expenseUSD) * 100 : 0;
            const isLast = idx === Math.min(topExpenseCategories.length, 8) - 1;
            return (
              <View key={cat.categoryId} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <View style={[pdfStyles.td, { flex: 3 }, pdfStyles.categoryCell]}>
                  <View style={[pdfStyles.colorDot, { backgroundColor: cat.color }]} />
                  <Text>{cat.name}</Text>
                </View>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{formatCurrency(cat.usd, "USD")}</Text>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{percent.toFixed(1)}%</Text>
              </View>
            );
          })}
        </View>
      </>
    )}

    <Text style={pdfStyles.note}>
      Los montos en USD son exactos (moneda base). Los montos en COP son exactos para movimientos registrados en COP,
      o registrados en USD con su propia tasa de cambio; los que no tienen una tasa registrada no se incluyen en el total COP.
    </Text>

    <PdfFooter generatedAtLabel={generatedAtLabel} />
  </Page>
);
