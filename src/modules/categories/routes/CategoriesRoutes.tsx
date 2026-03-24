import { Route, Routes } from "react-router-dom";
import { Categories } from "../pages/Categories";

export const CategoriesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Categories />} />
      <Route path="create" element={<Categories />} />
      <Route path="delete/:id" element={<Categories />} />
    </Routes>
  );
};
