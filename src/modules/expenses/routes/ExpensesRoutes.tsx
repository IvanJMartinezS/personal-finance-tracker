import { Route, Routes } from "react-router-dom"
import { ExpensesList } from "../pages/ExpensesList";


export const ExpensesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpensesList />} />
    </Routes>
  );
}