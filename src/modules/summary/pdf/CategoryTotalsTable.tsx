import { Text, View } from "@react-pdf/renderer";
import { formatCOP, formatCurrency } from "@/lib/mock-data";
import { pdfStyles } from "./pdfStyles";
import type { CategoryTotal } from "../hooks/useAnnualReportData";

interface CategoryTotalsTableProps {
  categories: CategoryTotal[];
  totalUSD: number;
  totalCOP: number;
  emptyLabel: string;
}

export const CategoryTotalsTable = ({ categories, totalUSD, totalCOP, emptyLabel }: CategoryTotalsTableProps) => {
  if (categories.length === 0) {
    return (
      <View style={pdfStyles.table}>
        <Text style={pdfStyles.emptyState}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <View style={pdfStyles.table}>
      <View style={pdfStyles.tableHeaderRow}>
        <Text style={[pdfStyles.th, { flex: 3 }]}>Categoría</Text>
        <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>USD</Text>
        <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>COP</Text>
      </View>
      {categories.map((cat, idx) => (
        <View key={cat.categoryId} style={idx === categories.length - 1 ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
          <View style={[pdfStyles.td, { flex: 3 }, pdfStyles.categoryCell]}>
            <View style={[pdfStyles.colorDot, { backgroundColor: cat.color }]} />
            <Text>{cat.name}</Text>
          </View>
          <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{formatCurrency(cat.usd, "USD")}</Text>
          <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{formatCOP(cat.cop)}</Text>
        </View>
      ))}
      <View style={[pdfStyles.tableRowLast, { backgroundColor: "#f8fafc" }]}>
        <Text style={[pdfStyles.td, { flex: 3, fontFamily: "Helvetica-Bold" }]}>Total</Text>
        <Text style={[pdfStyles.tdRight, { flex: 1, fontFamily: "Helvetica-Bold" }]}>{formatCurrency(totalUSD, "USD")}</Text>
        <Text style={[pdfStyles.tdRight, { flex: 1, fontFamily: "Helvetica-Bold" }]}>{formatCOP(totalCOP)}</Text>
      </View>
    </View>
  );
};
