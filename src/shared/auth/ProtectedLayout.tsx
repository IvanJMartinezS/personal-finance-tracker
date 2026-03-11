import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/auth/useAuth';
import Layout from '@/shared/components/layout/Layout';
import { Loader } from '@/shared/components/ui/loader';
import { useTranslation } from 'react-i18next';

export default function ProtectedLayout() {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('loading.' + key);

  const { user, loading } = useAuth();
  if (loading) return <Loader label={i18nString('default')} />;
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout><Outlet /></Layout>;
}