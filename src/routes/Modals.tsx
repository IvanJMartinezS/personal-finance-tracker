import { Route, Routes, useLocation } from "react-router-dom";
import { CreateExpenseDialog } from "@/modules/expenses/pages/CreateExpenseDialog";
import { DeleteExpenseButton } from "@/modules/expenses/pages/DeleteExpenseButton";
import { EditExpenseDialog } from "@/modules/expenses/pages/EditExpenseDialog";
import { CreateIncomeDialog } from "@/modules/incomes/pages/CreateIncomeDialog";
import { DeleteIncomeButton } from "@/modules/incomes/pages/DeleteIncomeButton";
import { CreateCategoryDialog } from "@/modules/categories/pages/CreateCategoryDialog";
import { EditIncomeDialog } from "@/modules/incomes/pages/EditIncomeDialog";
import { DeleteCategoryButton } from "@/modules/categories/pages/DeleteCategoryButton";
import { EditCategoryDialog } from "@/modules/categories/pages/EditCategoryDialog";
import { CreateAccountDialog } from "@/modules/accounts/pages/CreateAccountDialog";
import { DeleteAccountButton } from "@/modules/accounts/pages/DeleteAccountButton";
import { UpsertSnapshotDialog } from "@/modules/accounts/pages/UpsertSnapshotDialog";

export const Modals = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  if (!state?.backgroundLocation) return null;

  return (
    <Routes>
      /* Expenses */
      <Route path="expenses/create" element={<CreateExpenseDialog />} />
      <Route path="expenses/delete/:id" element={<DeleteExpenseButton />} />
      <Route path="expenses/edit/:id" element={<EditExpenseDialog />} />

      /* Incomes */
      <Route path="incomes/create" element={<CreateIncomeDialog />} />
      <Route path="incomes/delete/:id" element={<DeleteIncomeButton />} />
      <Route path="incomes/edit/:id" element={<EditIncomeDialog />} />

      /* Categories */
      <Route path="categories/create" element={<CreateCategoryDialog />} />
      <Route path="categories/edit/:id" element={<EditCategoryDialog />} />
      <Route path="categories/delete/:id" element={<DeleteCategoryButton />} />

      
      <Route path="accounts/create" element={<CreateAccountDialog />} />
      <Route path="accounts/delete/:id" element={<DeleteAccountButton />} />
      <Route path="accounts/snapshot/:accountId" element={<UpsertSnapshotDialog />} />
    </Routes>
  );
};
