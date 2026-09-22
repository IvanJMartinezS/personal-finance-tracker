import { PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatCurrency } from "@/lib/mock-data";

interface BudgetSummaryCardProps {
  totalUSD: number;
  label: string;
  subtitle: string;
}

/**
 * Fila destacada (no es una cuenta real) que muestra el total presupuestado
 * — para diferenciarla de las cuentas de verdad se usa un estilo distinto
 * (borde punteado + fondo tintado) y no se agrupa con ellas.
 */
export const BudgetSummaryCard = ({ totalUSD, label, subtitle }: BudgetSummaryCardProps) => {
  // Sin presupuestos configurados no hay nada que destacar aquí.
  if (totalUSD <= 0) return null;

  return (
    <Card className="border-dashed border-primary/40 bg-primary/5">
      <CardContent className="flex items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <PiggyBank className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{label}</p>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>
        <p className="text-lg font-bold money-font text-primary shrink-0">{formatCurrency(totalUSD, "USD")}</p>
      </CardContent>
    </Card>
  );
};
