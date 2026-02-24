import { useAuth } from "@/hooks/useAuth"; 
import { Navigate, Outlet } from "react-router";
import Layout from "@/components/Layout";

export default function AppLayout() {
    const { user, loading } = useAuth();
  
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      );
    }
  
    if (!user) {
      return <Navigate to="/auth" replace />;
    }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}