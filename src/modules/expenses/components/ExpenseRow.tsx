import { TrendingDown } from "lucide-react";
import { formatCOP, formatCurrency } from "@/lib/mock-data";
import type { Expense } from "../utils/types";
import { DeleteExpenseButton } from "../pages/DeleteExpenseButton";

interface ExpenseRowProps {
  expense: Expense;
}

export const ExpenseRow = ({ expense }: ExpenseRowProps) => {
  const cat = expense.categories;
  const formattedDate = new Date(expense.date + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
      <DeleteExpenseButton id={expense.id} />
    </div>
  );
};