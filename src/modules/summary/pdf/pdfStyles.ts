import { StyleSheet } from "@react-pdf/renderer";

/**
 * Colores de marca de la app (ver src/index.css, tema claro) convertidos a
 * hex para el PDF. Un documento para compartir/imprimir siempre usa fondo
 * claro, sin importar el tema (claro/oscuro) que tenga la app en pantalla —
 * es la convención estándar de cualquier reporte/documento.
 */
export const pdfColors = {
  primary: "#10b981",
  success: "#10b981",
  destructive: "#dc2626",
  warning: "#f59e0b",
  text: "#1e293b",
  mutedText: "#64748b",
  border: "#e5e7eb",
  mutedBg: "#f8fafc",
  white: "#ffffff",
};

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: pdfColors.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: pdfColors.primary,
  },
  brand: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.primary,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 9,
    color: pdfColors.mutedText,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: pdfColors.mutedText,
    borderTopWidth: 1,
    borderTopColor: pdfColors.border,
    paddingTop: 6,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 6,
    padding: 10,
  },
  kpiLabel: {
    fontSize: 8,
    color: pdfColors.mutedText,
    marginBottom: 4,
  },
  kpiValueUSD: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },
  kpiValueCOP: {
    fontSize: 8,
    color: pdfColors.mutedText,
    marginTop: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.border,
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: pdfColors.mutedBg,
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.border,
  },
  th: {
    padding: 6,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: pdfColors.mutedText,
  },
  td: {
    padding: 6,
    fontSize: 8,
  },
  tdRight: {
    padding: 6,
    fontSize: 8,
    textAlign: "right",
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  categoryCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  note: {
    fontSize: 7,
    color: pdfColors.mutedText,
    marginTop: 8,
  },
  emptyState: {
    padding: 16,
    textAlign: "center",
    fontSize: 8,
    color: pdfColors.mutedText,
  },
});
