import { Route, Routes, useLocation } from "react-router-dom";
import { CreateExpenseDialog } from "@/modules/expenses/pages/CreateExpenseDialog";
import { DeleteExpenseButton } from "@/modules/expenses/pages/DeleteExpenseButton";
import { CreateIncomeDialog } from "@/modules/incomes/pages/CreateIncomeDialog";
import { DeleteIncomeButton } from "@/modules/incomes/pages/DeleteIncomeButton";
import { CreateCategoryDialog } from "@/modules/categories/pages/CreateCategoryDialog";
import { DeleteCategoryButton } from "@/modules/categories/pages/DeleteCategoryButton";

export const Modals = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  if (!state?.backgroundLocation) return null;

  return (
    <Routes>
      <Route path="expenses/create" element={<CreateExpenseDialog />} />
      <Route path="expenses/delete/:id" element={<DeleteExpenseButton />} />
      <Route path="incomes/create" element={<CreateIncomeDialog />} />
      <Route path="incomes/delete/:id" element={<DeleteIncomeButton />} />
      <Route path="categories/create" element={<CreateCategoryDialog />} />
      <Route path="categories/delete/:id" element={<DeleteCategoryButton />} />
    </Routes>
  );
};
