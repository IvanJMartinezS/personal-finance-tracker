// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { authLoader } from './loaders';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFoundPage';
import IncomePage from '@/pages/IncomePage';
import ExpensesPage from '@/pages/ExpensesPage';
import ProtectedLayout from '@/components/ProtectedLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import RootLayout from '@/components/RootLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/auth', element: <AuthPage /> },
      {
        element: <ProtectedLayout />,
        loader: authLoader,
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Cargando...</div>}>
                <Dashboard />
              </Suspense>
            ),
          },
          { path: 'expenses', element: <ExpensesPage /> },
          { path: 'income', element: <IncomePage /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);