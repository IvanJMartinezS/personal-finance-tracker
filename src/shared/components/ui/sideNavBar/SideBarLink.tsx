import { NavLink } from "@/shared/components/ui/NavLink";
import { useTranslation } from "react-i18next";

export const SideNavLink = ({ item, setSidebarOpen }: any) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('sideNavBar.' + key);

  return (
    <div>
      <NavLink key={item.url} to={item.url} end={item.url === "/"} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" activeClassName="bg-primary/10 text-primary font-medium" onClick={() => setSidebarOpen(false)}>
        <item.icon className="h-4.5 w-4.5" />
        <span>{i18nString(item.title)}</span>
      </NavLink>
    </div>
  );
} 