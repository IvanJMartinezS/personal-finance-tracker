import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useDeleteIncome } from "../hooks/useDeleteIncome";

interface DeleteIncomeProps {
  id: string;
}

export const DeleteIncome = ({ id }: DeleteIncomeProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('incomes.' + key);

  const deleteIncome = useDeleteIncome();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString("deleteIncome")}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString("deleteIncomeDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{i18nString("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteIncome.mutate(id)}>{i18nString("delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};