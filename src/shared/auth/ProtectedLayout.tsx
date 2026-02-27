import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/auth/useAuth';
import Layout from '@/shared/components/layout/Layout';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout><Outlet /></Layout>;
}