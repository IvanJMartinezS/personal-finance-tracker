import { Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, pdfColors } from "./pdfStyles";
import { PdfHeader } from "./PdfHeader";
import { PdfFooter } from "./PdfFooter";
import { toUSD, fmtUSD } from "@/modules/accounts/hooks/useAccountsSummary";
import type { Account, AccountSnapshot } from "@/modules/accounts/utils/types";

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  savings: "Ahorros",
  investment: "Inversión",
  owed_to_me: "Me deben",
  cash: "Efectivo",
};

function fmtNative(amount: number, currency: string): string {
  if (currency === "USD") return `US$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const symbol = currency === "COP" ? "$" : "Bs.";
  return `${symbol}${amount.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

interface AccountsPageProps {
  year: number;
  generatedAtLabel: string;
  accounts: Account[];
  snapshotMap: Record<string, Record<number, AccountSnapshot>>;
  currentMonth: number;
  totalUSD: number;
}

export const AccountsPage = ({ year, generatedAtLabel, accounts, snapshotMap, currentMonth, totalUSD }: AccountsPageProps) => {
  const rows = accounts.filter((acc) => snapshotMap[acc.id]?.[currentMonth]);

  return (
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader title="Cuentas y saldos" subtitle={`Saldo del último mes registrado, año ${year}`} />

      {rows.length === 0 ? (
        <View style={pdfStyles.table}>
          <Text style={pdfStyles.emptyState}>No hay saldos de cuentas registrados este año.</Text>
        </View>
      ) : (
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            <Text style={[pdfStyles.th, { flex: 2 }]}>Cuenta</Text>
            <Text style={[pdfStyles.th, { flex: 1 }]}>Tipo</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Saldo</Text>
            <Text style={[pdfStyles.th, { flex: 1, textAlign: "right" }]}>Equivalente USD</Text>
          </View>

          {rows.map((acc, idx) => {
            const snap = snapshotMap[acc.id][currentMonth];
            const usd = toUSD(snap.amount, acc.currency, snap.exchange_rate);
            const isLast = idx === rows.length - 1;
            return (
              <View key={acc.id} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <View style={[pdfStyles.td, { flex: 2 }, pdfStyles.categoryCell]}>
                  <View style={[pdfStyles.colorDot, { backgroundColor: acc.color }]} />
                  <Text>{acc.name}</Text>
                </View>
                <Text style={[pdfStyles.td, { flex: 1 }]}>{ACCOUNT_TYPE_LABELS[acc.type]}</Text>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{fmtNative(snap.amount, acc.currency)}</Text>
                <Text style={[pdfStyles.tdRight, { flex: 1 }]}>{usd === null ? "—" : fmtUSD(usd)}</Text>
              </View>
            );
          })}

          <View style={[pdfStyles.tableRowLast, { backgroundColor: pdfColors.mutedBg }]}>
            <Text style={[pdfStyles.td, { flex: 4, fontFamily: "Helvetica-Bold" }]}>Total en USD</Text>
            <Text style={[pdfStyles.tdRight, { flex: 1, fontFamily: "Helvetica-Bold" }]}>{fmtUSD(totalUSD)}</Text>
          </View>
        </View>
      )}

      <Text style={pdfStyles.note}>
        El equivalente en USD usa la tasa registrada al guardar cada saldo. Las cuentas sin una tasa registrada muestran "—" en vez de
        una conversión estimada.
      </Text>

      <PdfFooter generatedAtLabel={generatedAtLabel} />
    </Page>
  );
};
