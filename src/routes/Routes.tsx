import { Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomePage from "@/pages/IncomePage";
import AuthPage from "@/pages/AuthPage";
import type { LocationState } from "@/types/router";
//import NotFound from "@/pages/NotFoundPage";

export const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const backgroundLocation = state?.backgroundLocation || location;
  
  return (
     <Routes location={backgroundLocation}>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route element={<AppLayout />}>
        <Route path="/">
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route path="/expenses">
          <Route index element={<ExpensesPage />} />
        </Route>

        <Route path="/income">
          <Route index element={<IncomePage />} />
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="*" element={<AuthPage />} />
      </Route>
    </Routes>
  );
}