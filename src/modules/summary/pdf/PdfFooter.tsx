import { Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

interface PdfFooterProps {
  generatedAtLabel: string;
}

export const PdfFooter = ({ generatedAtLabel }: PdfFooterProps) => (
  <View style={pdfStyles.footer} fixed>
    <Text>{generatedAtLabel}</Text>
    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </View>
);
