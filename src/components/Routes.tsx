import { useLocation, Routes, Route } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import ProtectedLayout from '@/components/ProtectedLayout';
import Dashboard from '@/pages/Dashboard';
import ExpensesPage from '@/pages/ExpensesPage';
import IncomePage from '@/pages/IncomePage';
import NotFound from '@/pages/NotFoundPage';
import { CreateExpenseModal } from '@/components/CreateExpensesModal';

export function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <div>
      <Routes location={backgroundLocation}>
        <Route path="auth" element={<AuthPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="income" element={<IncomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

          <Routes>
            <Route path="expenses">
              <Route path="create-expense" element={<CreateExpenseModal />} />
            </Route>
          </Routes>
    </div>
  );
}