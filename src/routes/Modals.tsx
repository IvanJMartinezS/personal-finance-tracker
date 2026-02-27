import { CreateExpense } from "@/modules/expenses/pages/CreateExpense";
import { Route, Routes } from "react-router-dom";


export const Modals = () => {
  return (
    <Routes>
        <Route path="expenses">
          <Route path="create-expense" element={<CreateExpense />} />
        </Route>
      </Routes>
  );
}