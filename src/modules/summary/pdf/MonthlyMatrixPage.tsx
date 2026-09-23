import { Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, pdfColors } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { PdfFooter } from "./PdfFooter";
import type { YearlySummary } from "../hooks/useYearlySummary";

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface MonthlyMatrixPageProps {
  year: number;
  generatedAtLabel: string;
  monthlySummary: YearlySummary;
  elapsedMonths: number;
}

function fmtUSD(val: number): string {
  return val === 0 ? "—" : `$${val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const matrixStyles = {
  categoryCol: { flex: 2.2 },
  monthCol: { flex: 1 },
};

export const MonthlyMatrixPage = ({ year, generatedAtLabel, monthlySummary, elapsedMonths }: MonthlyMatrixPageProps) => {
  const months = Array.from({ length: elapsedMonths }, (_, i) => i + 1);
  const categories = monthlySummary.categories;

  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.page}>
      <PdfHeader title="Resumen mensual por categoría (USD)" subtitle={`Gastos mes a mes durante ${year}`} />

      {categories.length === 0 ? (
        <View style={pdfStyles.table}>
          <Text style={pdfStyles.emptyState}>No hay categorías con gastos registrados este año.</Text>
        </View>
      ) : (
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            <Text style={[pdfStyles.th, matrixStyles.categoryCol]}>Categoría</Text>
            {months.map((m) => (
              <Text key={m} style={[pdfStyles.th, matrixStyles.monthCol, { textAlign: "right" }]}>
                {MONTH_LABELS[m - 1]}
              </Text>
            ))}
            <Text style={[pdfStyles.th, matrixStyles.monthCol, { textAlign: "right" }]}>Total</Text>
          </View>

          {categories.map((cat, idx) => {
            let rowTotal = 0;
            const isLast = idx === categories.length - 1;
            return (
              <View key={cat.id} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <View style={[pdfStyles.td, matrixStyles.categoryCol, pdfStyles.categoryCell]}>
                  <View style={[pdfStyles.colorDot, { backgroundColor: cat.color }]} />
                  <Text>{cat.name}</Text>
                </View>
                {months.map((m) => {
                  const usd = monthlySummary.months[m]?.byCategory[cat.id]?.amountUSD ?? 0;
                  rowTotal += usd;
                  return (
                    <Text
                      key={m}
                      style={[pdfStyles.tdRight, matrixStyles.monthCol, usd === 0 ? { color: pdfColors.mutedText } : undefined]}
                    >
                      {fmtUSD(usd)}
                    </Text>
                  );
                })}
                <Text style={[pdfStyles.tdRight, matrixStyles.monthCol, { fontFamily: "Helvetica-Bold" }]}>{fmtUSD(rowTotal)}</Text>
              </View>
            );
          })}

          <View style={[pdfStyles.tableRowLast, { backgroundColor: pdfColors.mutedBg }]}>
            <Text style={[pdfStyles.td, matrixStyles.categoryCol, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
            {months.map((m) => (
              <Text key={m} style={[pdfStyles.tdRight, matrixStyles.monthCol, { fontFamily: "Helvetica-Bold" }]}>
                {fmtUSD(monthlySummary.months[m]?.totalUSD ?? 0)}
              </Text>
            ))}
            <Text style={[pdfStyles.tdRight, matrixStyles.monthCol, { fontFamily: "Helvetica-Bold" }]}>
              {fmtUSD(months.reduce((s, m) => s + (monthlySummary.months[m]?.totalUSD ?? 0), 0))}
            </Text>
          </View>
        </View>
      )}

      <Text style={pdfStyles.note}>
        Montos en USD (moneda base), la más precisa para comparar entre meses. Para el detalle en pesos, ver la sección de categorías.
      </Text>

      <PdfFooter generatedAtLabel={generatedAtLabel} />
    </Page>
  );
};
