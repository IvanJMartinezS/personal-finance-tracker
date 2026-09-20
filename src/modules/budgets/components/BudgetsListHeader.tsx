import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface BudgetsListHeaderProps {
  total: number;
}

export const BudgetsListHeader = ({ total }: BudgetsListHeaderProps) => {
  const i18nString = useModuleTranslation("budgets");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreate = () => {
    navigate("create", { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
        <p className="text-sm text-muted-foreground">{total} {i18nString("configBudgets")}</p>
      </div>
      <Button className="gap-2" onClick={handleCreate}>
        <Plus className="h-4 w-4" />
        {i18nString("newBudget")}
      </Button>
    </div>
  );
};
