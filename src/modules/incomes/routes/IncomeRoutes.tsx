import { Route, Routes } from "react-router-dom"
import { IncomeList } from "../pages/IncomeList";


export const IncomeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IncomeList />} />
    </Routes>
  );
}