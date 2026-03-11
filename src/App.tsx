import { AuthProvider } from "@/shared/auth/useAuth";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/Routes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/index";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
     <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            </I18nextProvider>
          </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;