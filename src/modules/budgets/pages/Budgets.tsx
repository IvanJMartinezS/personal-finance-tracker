import { useMemo } from "react";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { useDialogRouteFallback } from "@/shared/hooks/useDialogRouteFallback";
import { useGetBudgets } from "../hooks/useGetBudgets";
import { useBudgetsUsage } from "../hooks/useBudgetsUsage";
import { Card, CardContent } from "@/shared/components/ui/card";
import { BudgetsListHeader } from "../components/BudgetsListHeader";
import { BudgetsListSkeleton } from "../components/BudgetsListSkeleton";
import { BudgetRow } from "../components/BudgetRow";
import { BudgetsHistorySection } from "../components/BudgetsHistorySection";
import { sumBudgetsUSD } from "../utils/sumBudgetsUSD";
import { calculateNetBudgetUsage } from "../utils/calculateNetBudgetUsage";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { EditBudgetDialog } from "./EditBudgetDialog";
import { DeleteBudgetButton } from "./DeleteBudgetButton";
import { CorrectBudgetMonthDialog } from "./CorrectBudgetMonthDialog";

export const Budgets = () => {
  const i18nString = useModuleTranslation("budgets");
  const { data: budgets, isLoading } = useGetBudgets();
  const totalAmountUSD = useMemo(() => sumBudgetsUSD(budgets), [budgets]);

  const now = new Date();
  const { data: budgetsUsage } = useBudgetsUsage(now.getFullYear(), now.getMonth() + 1);
  const netUsage = useMemo(() => calculateNetBudgetUsage(budgetsUsage), [budgetsUsage]);

  const { isCreateDialog, isEditDialog, isDeleteDialog, isCorrectMonthDialog } = useDialogRouteFallback();

  if (isLoading) return <BudgetsListSkeleton />;

  return (
    <>
      <div className="space-y-5 animate-fade-in">
        <BudgetsListHeader total={budgets.length} totalAmountUSD={totalAmountUSD} netUsage={netUsage} />
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

        <BudgetsHistorySection />
      </div>

      {isCreateDialog && <CreateBudgetDialog />}
      {isEditDialog && <EditBudgetDialog />}
      {isDeleteDialog && <DeleteBudgetButton />}
      {isCorrectMonthDialog && <CorrectBudgetMonthDialog />}
    </>
  );
};
