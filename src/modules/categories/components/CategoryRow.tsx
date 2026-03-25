import { Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { Button } from "@/shared/components/ui/button";
import type { Category } from "../utils/types";

interface CategoryRowProps {
  category: Category;
}

export const CategoryRow = ({ category }: CategoryRowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const i18nString = useModuleTranslation("categories");

  const handleDelete = () => {
    navigate(`delete/${category.id}`, { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
      <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
      <span className="text-sm font-medium flex-1">{category.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        aria-label={i18nString("deleteCategory")}
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
