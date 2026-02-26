// src/components/RootLayout.tsx
import { useLocation, Routes, Route } from 'react-router-dom';
import { Modal } from '@/components/Modal';
import { CreateExpenseModal } from './CreateExpensesModal';


// src/router/index.tsx
// import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
// import { authLoader } from './loaders';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFoundPage';
import IncomePage from '@/pages/IncomePage';
import ExpensesPage from '@/pages/ExpensesPage';
// import CreateExpensePage from '@/pages/CreateExpensePage'; // 👈 página completa
import ProtectedLayout from '@/components/ProtectedLayout';
// import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = lazy(() => import('@/pages/Dashboard'));


export default function RootLayout() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      {/* <Outlet /> */}
      <Routes location={backgroundLocation || location}>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="income" element={<IncomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {backgroundLocation && (
        <Modal>
          <Routes>
            {/* <Route path="/create-expense" element={<CreateExpenseModal />} /> */}
            <Route path="/create-expense" element={<CreateExpenseModal />} />
          </Routes>
        </Modal>
      )}
    </>
  );
}