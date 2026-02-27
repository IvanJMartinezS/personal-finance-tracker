import { useLocation, Routes, Route } from 'react-router-dom';
import AuthPage from '@/modules/auth/pages/AuthPage';
import ProtectedLayout from '@/shared/auth/ProtectedLayout';
import { ExpensesRoutes } from '@/modules/expenses/routes/ExpensesRoutes';
import { IncomeRoutes } from '@/modules/incomes/routes/IncomeRoutes';
import { DashboardRoutes } from '@/modules/dashboard/routes/DashboardRoutes';
import { NotFoundPage } from '@/modules/notFound/pages/NotFoundPage';
import { CategoriesRoutes } from '@/modules/categories/routes/CategoriesRoutes';
import { SettingsRoutes } from '@/modules/settings/routes/SettingsRoutes';
import { Modals } from '@/routes/Modals';

export function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <div>
      <Routes location={backgroundLocation}>
        <Route path="auth" element={<AuthPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index path='home' element={<DashboardRoutes />} />
          <Route path="expenses" element={<ExpensesRoutes />} />
          <Route path="income" element={<IncomeRoutes />} />
          <Route path="categories" element={<CategoriesRoutes />} />
            <Route path="settings" element={<SettingsRoutes />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Modals />      
    </div>
  );
}