import { Card, CardContent } from "@/shared/components/ui/card";
import { formatCOP } from "@/lib/mock-data";
import { fmtUSD } from "../hooks/useAccountsSummary";

interface AccountsSummaryCardsProps {
  usd: number;
  cop: number;
  /** Equivalente en USD de las cuentas en COP, sumado cuenta por cuenta con la tasa de cada una (no una tasa fija sobre el agregado). */
  copUSD: number;
  totalUSD: number;
  totalUSDLabel: string;
}

export const AccountsSummaryCards = ({ usd, cop, copUSD, totalUSD, totalUSDLabel }: AccountsSummaryCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-border/50">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-1">USD</p>
          <p className="text-2xl font-bold money-font text-success">{fmtUSD(usd)}</p>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-1">COP</p>
          <p className="text-2xl font-bold money-font">{formatCOP(cop)}</p>
          <p className="text-xs text-muted-foreground">{fmtUSD(copUSD)}</p>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-1">{totalUSDLabel}</p>
          <p className="text-2xl font-bold money-font text-primary">{fmtUSD(totalUSD)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
