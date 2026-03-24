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
import { useDeleteCategory } from "../hooks/useDeleteCategories";

export const DeleteCategoryButton = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`categories.${key}`);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteCategory = useDeleteCategory();
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
    deleteCategory.mutate(id, {
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
          <AlertDialogTitle>{i18nString("deleteCategory")}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString("deleteCategoryDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isPending} onClick={handleClose}>
            {i18nString("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteCategory.isPending}>
            {deleteCategory.isPending ? i18nString("deleting") : i18nString("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
