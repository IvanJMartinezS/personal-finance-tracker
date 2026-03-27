import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModuleTranslation } from "@/shared/hooks/useModuleTranslation";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

export const DeleteAccountButton = () => {
  const i18nString = useModuleTranslation("accounts");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(t);
    }
  }, [open, navigate]);

  const handleDelete = () => {
    if (!id || submitted.current) return;
    submitted.current = true;
    deleteAccount.mutate(id, {
      onSuccess: () => { toast.success(i18nString("deleteSuccess")); handleClose(); },
      onError: (e) => { submitted.current = false; toast.error(i18nString("deleteError"), { description: e.message }); },
    });
  };

  const isPending = deleteAccount.isPending || submitted.current;

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18nString("deleteAccount")}</AlertDialogTitle>
          <AlertDialogDescription>{i18nString("deleteAccountDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={handleClose}>{i18nString("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="gap-2">
            {isPending && <ButtonSpinner />}
            {isPending ? i18nString("deleting") : i18nString("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
