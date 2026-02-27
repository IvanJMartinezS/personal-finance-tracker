import {
  LayoutDashboard, TrendingDown, TrendingUp, Tags, Settings,
} from "lucide-react";

interface NavLin {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const NavLinks: NavLin[] = [
  { title: "Dashboard", url: "/home", icon: LayoutDashboard },
  { title: "Gastos", url: "/expenses", icon: TrendingDown },
  { title: "Ingresos", url: "/income", icon: TrendingUp },
  { title: "Categorías", url: "/categories", icon: Tags },
  { title: "Configuración", url: "/settings", icon: Settings },
]