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
import { useDeleteExpense } from "../hooks/useDeleteExpense";

interface DeleteExpenseProps {
  id: string;
}

export const DeleteExpense = ({ id }: DeleteExpenseProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key); // Nota: era 'expense.' pero en tu i18n usas 'expenses'

  const deleteExpense = useDeleteExpense();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString('deleteExpense')}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString('deleteExpenseDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{i18nString('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteExpense.mutate(id)}>
            {i18nString('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};