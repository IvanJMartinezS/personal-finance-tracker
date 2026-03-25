import { useGetCategories } from "@/modules/categories/hooks/useGetCategories";
import { CategoriesListHeader } from "../components/CategoriesListHeader";
import { CategoriesListSkeleton } from "../components/CategoriesListSkeleton";
import { CategoriesSection } from "../components/CategoriesSection";

export const Categories = () => {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) return <CategoriesListSkeleton />;

  const expenseCats = categories?.filter((c) => c.type === "expense") ?? [];
  const incomeCats = categories?.filter((c) => c.type === "income") ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <CategoriesListHeader total={categories?.length ?? 0} />
      <CategoriesSection titleKey="expenses" categories={expenseCats} />
      <CategoriesSection titleKey="incomes" categories={incomeCats} />
    </div>
  );
};
