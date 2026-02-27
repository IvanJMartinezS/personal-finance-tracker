import { Button } from "@/shared/components/ui/button";
import {
  Menu, Moon, Sun,
} from "lucide-react";
import {  useState } from "react";


export const Header = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => {
  const [darkMode, setDarkMode] = useState(true);  

  const toggleDark = () => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle("dark");
    };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <h2 className="text-lg font-semibold">Bienvenido</h2>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDark} className="h-9 w-9">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
} 