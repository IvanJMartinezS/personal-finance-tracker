import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { formatCOP } from "@/lib/mock-data";
import { fmtUSD, toUSD } from "../hooks/useAccountsSummary";
import type { Account, AccountSnapshot } from "../utils/types";

interface AccountsByCurrencySectionProps {
  currency: "USD" | "COP" | "VES";
  accounts: Account[];
  snapshotForAccount: (accountId: string) => AccountSnapshot | undefined;
  noBalanceLabel: string;
  registerBalanceLabel: string;
  typeLabel: (type: string) => string;
  onRegisterBalance: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
}

export const AccountsByCurrencySection = ({
  currency,
  accounts,
  snapshotForAccount,
  noBalanceLabel,
  registerBalanceLabel,
  typeLabel,
  onRegisterBalance,
  onDeleteAccount,
}: AccountsByCurrencySectionProps) => {
  if (!accounts.length) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {currency}
          <Badge variant="secondary">{accounts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {accounts.map((acc) => {
            const snap = snapshotForAccount(acc.id);
            return (
              <div key={acc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: acc.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: acc.color }}>{acc.name}</p>
                  <p className="text-xs text-muted-foreground">{typeLabel(acc.type)}</p>
                </div>
                <div className="text-right mr-2">
                  {snap ? (
                    <>
                      <p className="text-sm font-semibold money-font">
                        {currency === "COP" ? formatCOP(snap.amount) : `${snap.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${currency}`}
                      </p>
                      {currency !== "USD" && currency !== "VES" && (
                        <p className="text-xs text-muted-foreground">{fmtUSD(toUSD(snap.amount, currency))}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{noBalanceLabel}</p>
                  )}
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onRegisterBalance(acc.id)}
                  title={registerBalanceLabel}
                >
                  <PencilLine className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDeleteAccount(acc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
