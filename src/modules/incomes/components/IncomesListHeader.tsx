import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatCOP } from "@/lib/mock-data";

interface IncomesListHeaderProps {
  count: number;
  total: number;
}

export const IncomesListHeader = ({ count, total }: IncomesListHeaderProps) => {
  const i18nString = useModuleTranslation("incomes");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreate = () => {
    navigate("create", { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
        <p className="text-sm text-muted-foreground">
          {count} {i18nString("resumen")}
          <span className="money-font text-success ml-1">{formatCOP(total)}</span>
        </p>
      </div>
      <Button className="gap-2" onClick={handleCreate}>
        <Plus className="h-4 w-4" />
        {i18nString("newIncome")}
      </Button>
    </div>
  );
};
