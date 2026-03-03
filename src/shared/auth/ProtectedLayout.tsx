import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/auth/useAuth';
import Layout from '@/shared/components/layout/Layout';
import { Loader } from '@/shared/components/ui/loader';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Cargando..." />;
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout><Outlet /></Layout>;
}