import { Route, Routes } from "react-router-dom";
import { Summary } from "../pages/Summary";

export const SummaryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Summary />} />
    </Routes>
  );
};
