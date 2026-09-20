import { useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useGetBudgets } from "../hooks/useGetBudgets";
import { Card, CardContent } from "@/shared/components/ui/card";
import { BudgetsListHeader } from "../components/BudgetsListHeader";
import { BudgetsListSkeleton } from "../components/BudgetsListSkeleton";
import { BudgetRow } from "../components/BudgetRow";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { EditBudgetDialog } from "./EditBudgetDialog";
import { DeleteBudgetButton } from "./DeleteBudgetButton";

export const Budgets = () => {
  const location = useLocation();
  const i18nString = useModuleTranslation("budgets");
  const { data: budgets, isLoading } = useGetBudgets();

  // Verificar si estamos en una ruta de diálogo (fallback para navegación
  // directa/recarga sobre una subruta de modal — ver Modals.tsx para el caso
  // normal de navegación con backgroundLocation).
  const isCreateDialog = location.pathname.includes("/create");
  const isEditDialog = location.pathname.includes("/edit/");
  const isDeleteDialog = location.pathname.includes("/delete/");

  if (isLoading) return <BudgetsListSkeleton />;

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        <BudgetsListHeader total={budgets.length} />
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {budgets.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">{i18nString("noRecords")}</p>
            ) : (
              <div className="divide-y divide-border">
                {budgets.map((budget) => (
                  <BudgetRow key={budget.id} budget={budget} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isCreateDialog && <CreateBudgetDialog />}
      {isEditDialog && <EditBudgetDialog />}
      {isDeleteDialog && <DeleteBudgetButton />}
    </>
  );
};
