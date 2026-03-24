import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CategoriesListHeaderProps {
  total: number;
}

export const CategoriesListHeader = ({ total }: CategoriesListHeaderProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`categories.${key}`);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreate = () => {
    navigate("create", { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{i18nString("categories")}</h1>
        <p className="text-sm text-muted-foreground">{total} {i18nString("configCategories")}</p>
      </div>
      <Button className="gap-2" onClick={handleCreate}>
        <Plus className="h-4 w-4" />
        {i18nString("newCategory")}
      </Button>
    </div>
  );
};
