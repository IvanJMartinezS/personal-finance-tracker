import { Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

interface PdfHeaderProps {
  title: string;
  subtitle: string;
}

export const PdfHeader = ({ title, subtitle }: PdfHeaderProps) => (
  <View style={pdfStyles.header}>
    <View>
      <Text style={pdfStyles.brand}>FinTrack</Text>
      <Text style={pdfStyles.title}>{title}</Text>
      <Text style={pdfStyles.subtitle}>{subtitle}</Text>
    </View>
  </View>
);
