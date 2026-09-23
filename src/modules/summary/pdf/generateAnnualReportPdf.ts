import { pdf, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { AnnualReportDocument } from "./AnnualReportDocument";
import type { useAnnualReportData } from "../hooks/useAnnualReportData";

type AnnualReportData = ReturnType<typeof useAnnualReportData>;

/**
 * Genera el PDF y dispara la descarga con un enlace temporal, en vez de usar
 * `PDFDownloadLink` de @react-pdf/renderer — así el botón puede mostrar un
 * estado de carga mientras se genera, en lugar de renderizar el enlace de
 * descarga solo después de que el documento ya esté listo.
 */
export async function generateAnnualReportPdf(data: AnnualReportData): Promise<void> {
  // `AnnualReportDocument` renders a single <Document> root, pero su propio
  // tipo de props (`{ data }`) no es el `DocumentProps` que espera `pdf()` —
  // el cast es seguro porque el elemento real que produce en tiempo de
  // ejecución sí es un <Document>.
  const element = createElement(AnnualReportDocument, { data }) as unknown as ReactElement<DocumentProps>;
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-financiero-${data.year}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
