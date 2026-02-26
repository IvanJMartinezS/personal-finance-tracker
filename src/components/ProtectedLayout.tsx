import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout><Outlet /></Layout>;
}