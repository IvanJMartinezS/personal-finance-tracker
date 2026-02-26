import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/components/Routes";
//import { RouterProvider } from "react-router-dom";
//import { router } from "@/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
     <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <AuthProvider>
            {/* <RouterProvider router={router} /> */}
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;