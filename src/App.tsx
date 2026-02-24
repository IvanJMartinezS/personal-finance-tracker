import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomePage from "@/pages/IncomePage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFoundPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
    <BrowserRouter>
      <AuthProvider> 
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
            />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ExpensesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <IncomePage />
                </AppLayout>
              </ProtectedRoute>
            }
            />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;