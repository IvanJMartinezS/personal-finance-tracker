import { useTranslation } from "react-i18next";
import { CreateIncomeDialog } from "../pages/CreateIncomeDialog";
import { formatCOP } from "@/lib/mock-data";
import type { Category } from "../utils/types";

interface IncomesListHeaderProps {
  count: number;
  total: number;
  categories: Category[];
}

export const IncomesListHeader = ({ count, total, categories }: IncomesListHeaderProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{i18nString("title")}</h1>
        <p className="text-sm text-muted-foreground">
          {count} {i18nString("resumen")}
          <span className="money-font text-success ml-1">{formatCOP(total)}</span>
        </p>
      </div>
      <CreateIncomeDialog categories={categories} />
    </div>
  );
};
