import { Card, CardContent } from "@/shared/components/ui/card";
import { formatCOP, REFERENCE_USD_TO_COP_RATE } from "@/lib/mock-data";
import { fmtUSD } from "../hooks/useAccountsSummary";

interface AccountsSummaryCardsProps {
  usd: number;
  cop: number;
  totalUSD: number;
  totalUSDLabel: string;
}

export const AccountsSummaryCards = ({ usd, cop, totalUSD, totalUSDLabel }: AccountsSummaryCardsProps) => {
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
          <p className="text-xs text-muted-foreground">{fmtUSD(cop / REFERENCE_USD_TO_COP_RATE)}</p>
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
