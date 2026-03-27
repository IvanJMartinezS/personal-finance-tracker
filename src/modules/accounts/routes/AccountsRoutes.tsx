import { Route, Routes } from "react-router-dom";
import { AccountsPage } from "../pages/AccountsPage";

export const AccountsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AccountsPage />} />
      <Route path="create" element={<AccountsPage />} />
      <Route path="delete/:id" element={<AccountsPage />} />
      <Route path="snapshot/:accountId" element={<AccountsPage />} />
    </Routes>
  );
};
