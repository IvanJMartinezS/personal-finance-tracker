import { Page, Text, View } from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/mock-data";
import { pdfStyles, pdfColors } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { PdfFooter } from "./PdfFooter";
import { calculateBudgetUsage } from "@/modules/budgets/utils/calculateBudgetUsage";
import type { CategoryBudgetHistory } from "@/modules/budgets/utils/calculateBudgetHistory";

interface BudgetPageProps {
  year: number;
  generatedAtLabel: string;
  budgetsHistory: CategoryBudgetHistory[];
}

function statusColor(remainingUSD: number, amountUsd: number): string {
  const { percentAvailable } = calculateBudgetUsage(amountUsd, amountUsd - remainingUSD);
  if (percentAvailable > 50) return pdfColors.success;
  if (percentAvailable >= 20) return pdfColors.warning;
  return pdfColors.destructive;
}

export const BudgetPage = ({ year, generatedAtLabel, budgetsHistory }: BudgetPageProps) => {
  const rows = budgetsHistory.filter((h) => h.entries.length > 0);

  return (
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader title="Presupuesto por categoría" subtitle={`Estado a la fecha, año ${year}`} />

      {rows.length === 0 ? (
        <View style={pdfStyles.table}>
          <Text style={pdfStyles.emptyState}>No hay presupuestos aplicables a este año.</Text>
        </View>
      ) : (
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            <Text style={[pdfStyles.th, { flex: 2.5 }]}>Categoría</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Presupuesto</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Gastado (último mes)</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Disponible</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Acumulado</Text>
          </View>

          {rows.map((h, idx) => {
            const lastEntry = h.entries[h.entries.length - 1];
            const isLast = idx === rows.length - 1;
            return (
              <View key={h.budget.id} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <View style={[pdfStyles.td, { flex: 2.5 }, pdfStyles.categoryCell]}>
                  <View style={[pdfStyles.colorDot, { backgroundColor: h.budget.categories?.color ?? pdfColors.mutedText }]} />
                  <Text>{h.budget.categories?.name ?? "Sin categoría"}</Text>
                </View>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{formatCurrency(h.budget.amount_usd, "USD")}</Text>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{formatCurrency(lastEntry.spentUSD, "USD")}</Text>
                <Text style={[pdfStyles.tdRight, { flex: 1, color: statusColor(lastEntry.remainingUSD, h.budget.amount_usd) }]}>
                  {formatCurrency(lastEntry.remainingUSD, "USD")}
                </Text>
                <Text
                  style={[
                    pdfStyles.tdRight,
                    { flex: 1, fontFamily: "Helvetica-Bold", color: lastEntry.accumulatedUSD >= 0 ? pdfColors.success : pdfColors.destructive },
                  ]}
                >
                  {formatCurrency(lastEntry.accumulatedUSD, "USD")}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Text style={pdfStyles.note}>
        "Disponible" es lo que queda del presupuesto del último mes registrado. "Acumulado" es la suma de lo disponible de cada mes
        desde que se creó el presupuesto — un valor negativo indica que, en conjunto, se ha gastado más de lo presupuestado.
      </Text>

      <PdfFooter generatedAtLabel={generatedAtLabel} />
    </Page>
  );
};
