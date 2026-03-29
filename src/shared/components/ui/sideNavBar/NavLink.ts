import {
  LayoutDashboard, TrendingDown, TrendingUp, Tags, Settings, BarChart3, Wallet,
} from "lucide-react";

interface NavLin {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const NavLinks: NavLin[] = [
  { title: "dashboard", url: "/home", icon: LayoutDashboard },
  { title: "expenses", url: "/expenses", icon: TrendingDown },
  { title: "incomes", url: "/incomes", icon: TrendingUp },
  { title: "categories", url: "/categories", icon: Tags },
  { title: "accounts", url: "/accounts", icon: Wallet },
  { title: "summary", url: "/summary", icon: BarChart3 },
  { title: "settings", url: "/settings", icon: Settings },
]
