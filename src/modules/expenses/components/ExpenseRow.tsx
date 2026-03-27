import { TrendingDown, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { formatCOP, formatCurrency } from "@/lib/mock-data";
import { Button } from "@/shared/components/ui/button";
import type { Expense } from "../utils/types";

interface ExpenseRowProps {
  expense: Expense;
}

export const ExpenseRow = ({ expense }: ExpenseRowProps) => {
  const cat = expense.categories;
  const navigate = useNavigate();
  const location = useLocation();
  const i18nString = useModuleTranslation("expenses");

  const formattedDate = new Date(expense.date + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = () => {
    navigate(`delete/${expense.id}`, { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors sm:px-6">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: (cat?.color ?? '#888') + '20' }}
      >
        <TrendingDown className="h-4 w-4" style={{ color: cat?.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{expense.item}</p>
        <p className="text-xs text-muted-foreground">
          {cat?.name} · {formattedDate}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold money-font text-destructive">
          -{formatCurrency(Number(expense.amount), expense.currency)}
        </p>
        {expense.currency !== 'COP' && (
          <p className="text-[10px] text-muted-foreground money-font">
            ({formatCOP(Number(expense.amount_in_base))})
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        aria-label={i18nString("deleteExpense")}
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
