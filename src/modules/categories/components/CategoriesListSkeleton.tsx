import { Skeleton } from "@/shared/components/ui/skeleton";

export const CategoriesListSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-64 w-full" />
  </div>
);
