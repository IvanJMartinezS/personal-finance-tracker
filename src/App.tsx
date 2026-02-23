import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomePage from "@/pages/IncomePage";
import NotFound from "@/pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/expenses" element={<AppLayout><ExpensesPage /></AppLayout>} />
        <Route path="/income" element={<AppLayout><IncomePage /></AppLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;