import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { CategoryRow } from "./CategoryRow";
import type { Category } from "../utils/types";

interface CategoriesSectionProps {
  titleKey: string;
  categories: Category[];
}

export const CategoriesSection = ({ titleKey, categories }: CategoriesSectionProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`categories.${key}`);
  const title = i18nString(titleKey);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="text-xs">{categories.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {i18nString("noCategories")}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
