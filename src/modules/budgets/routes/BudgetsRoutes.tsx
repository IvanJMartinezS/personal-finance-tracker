import { Route, Routes } from "react-router-dom";
import { Budgets } from "../pages/Budgets";

export const BudgetsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Budgets />} />
      <Route path="create" element={<Budgets />} />
      <Route path="edit/:id" element={<Budgets />} />
      <Route path="delete/:id" element={<Budgets />} />
    </Routes>
  );
};
