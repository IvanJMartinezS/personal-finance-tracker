import { toast } from "sonner";
import { useAuth } from "@/shared/auth/useAuth";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { formatCurrency } from "@/lib/mock-data";
import { BudgetsService } from "../service";
import { ExpensesService } from "@/modules/expenses/service";
import { calculateBudgetUsage } from "../utils/calculateBudgetUsage";

const budgetsService = new BudgetsService();
const expensesService = new ExpensesService();

/**
 * Al guardar (crear o editar) un gasto, si su categoría tiene un presupuesto
 * asignado, avisa cuánto queda disponible de esa categoría este mes (o que se
 * superó el presupuesto). Si la categoría no tiene presupuesto, no hace nada.
 *
 * Se implementa como una consulta directa (no un hook reactivo) porque se usa
 * dentro del `onSuccess` de una mutación, ya con los datos recién guardados
 * en la base de datos — evita depender del momento en que React Query
 * refresque su caché.
 */
export const useNotifyBudgetUsage = () => {
  const { user } = useAuth();
  const i18nString = useModuleTranslation("budgets");

  return async (categoryId: string | null | undefined, expenseDate: string) => {
    if (!user || !categoryId) return;

    try {
      const budget = await budgetsService.getBudgetForCategory(user.id, categoryId);
      if (!budget) return;

      const [year, month] = expenseDate.split("-").map(Number);
      const totals = await expensesService.getMonthCategoryTotalsUSD(user.id, year, month);
      const spentUSD = totals[categoryId] ?? 0;
      const { remainingUSD } = calculateBudgetUsage(budget.amount_usd, spentUSD);
      const categoryName = budget.categories?.name ?? i18nString("uncategorized");

      if (remainingUSD >= 0) {
        toast.info(
          i18nString("remainingAvailable", { amount: formatCurrency(remainingUSD, "USD"), category: categoryName })
        );
      } else {
        toast.warning(
          i18nString("overBudget", { amount: formatCurrency(Math.abs(remainingUSD), "USD"), category: categoryName })
        );
      }
    } catch {
      // Es un aviso informativo adicional al guardado del gasto (que ya tuvo
      // éxito) — si esta consulta falla, se omite en silencio en vez de
      // mostrar un error sobre una operación que en realidad sí funcionó.
    }
  };
};
