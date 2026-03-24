import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useDeleteExpense } from "../hooks/useDeleteExpense";

export const DeleteExpenseButton = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`expenses.${key}`);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteExpense = useDeleteExpense();
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const handleDelete = () => {
    if (!id) return;
    deleteExpense.mutate(id, {
      onSuccess: () => {
        toast.success(i18nString("deleteSuccess"));
        handleClose();
      },
      onError: (error) => {
        toast.error(i18nString("deleteError"), { description: error.message });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString("deleteExpense")}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString("deleteExpenseDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteExpense.isPending} onClick={handleClose}>
            {i18nString("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteExpense.isPending}>
            {deleteExpense.isPending ? i18nString("deleting") : i18nString("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
