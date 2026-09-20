import { PencilLine, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/lib/mock-data";
import type { Budget } from "../utils/types";

interface BudgetRowProps {
  budget: Budget;
}

export const BudgetRow = ({ budget }: BudgetRowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const i18nString = useModuleTranslation("budgets");
  const cat = budget.categories;

  const handleEdit = () => {
    navigate(`edit/${budget.id}`, { state: { backgroundLocation: location } });
  };

  const handleDelete = () => {
    navigate(`delete/${budget.id}`, { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
      <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? "#888" }} />
      <span className="text-sm font-medium flex-1">{cat?.name ?? i18nString("uncategorized")}</span>
      <span className="text-sm font-semibold money-font">{formatCurrency(budget.amount_usd, "USD")}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:text-primary"
        aria-label={i18nString("editBudget")}
        onClick={handleEdit}
      >
        <PencilLine className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        aria-label={i18nString("deleteBudget")}
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
