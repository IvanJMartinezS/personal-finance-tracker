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
import { useState } from "react";
import { toast } from "sonner";

interface DeleteExpenseProps {
  id: string;
}

export const DeleteExpenseButton= ({ id }: DeleteExpenseProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('expenses.' + key);

  const deleteExpense = useDeleteExpense();

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteExpense.mutate(id, {
      onSuccess: () => {
        toast.success(i18nString('deleteSuccess'));
        setOpen(false);
      },
      onError: (error) => {
        toast.error(i18nString('deleteError'), { description: error.message });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"  aria-label={i18nString('deleteExpense')}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString('deleteExpense')}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString('deleteExpenseDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteExpense.isPending}>{i18nString('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteExpense.isPending}>
            {deleteExpense.isPending ? i18nString('deleting') : i18nString('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};