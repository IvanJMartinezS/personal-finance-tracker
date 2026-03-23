import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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

interface DeleteIncomeButtonProps {
  id: string;
}

export const DeleteIncomeButton = ({ id }: DeleteIncomeButtonProps) => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`incomes.${key}`);
  const deleteIncome = useDeleteIncome();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteIncome.mutate(id, {
      onSuccess: () => {
        toast.success(i18nString("deleteSuccess"));
        setOpen(false);
      },
      onError: (error) => {
        toast.error(i18nString("deleteError"), { description: error.message });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={i18nString("deleteIncome")}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString("deleteIncome")}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString("deleteIncomeDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteIncome.isPending}>{i18nString("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteIncome.isPending}>
            {deleteIncome.isPending ? i18nString("deleting") : i18nString("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
