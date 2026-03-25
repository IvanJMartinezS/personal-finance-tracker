import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ButtonSpinner } from "@/shared/components/ui/loader";
import { useCreateCategory } from "../hooks/useCreateCategory";

const PRESET_COLORS = [
  "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6",
  "#8b5cf6", "#f97316", "#3b82f6", "#22c55e", "#a855f7",
  "#ef4444", "#06b6d4",
];

export const CreateCategoryDialog = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t(`categories.${key}`);
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const [open, setOpen] = useState(true);
  const submitted = useRef(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => navigate(-1), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, navigate]);

  const handleSave = () => {
    if (!name || !type || submitted.current) return;
    submitted.current = true;
    createCategory.mutate(
      { name, type, color: selectedColor },
      {
        onSuccess: () => handleClose(),
        onError: () => { submitted.current = false; },
      }
    );
  };

  const isPending = createCategory.isPending || submitted.current;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18nString("newCategory")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{i18nString("nameCategory")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={i18nString("exampleItem")}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{i18nString("type")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder={i18nString("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">{i18nString("expense")}</SelectItem>
                <SelectItem value="income">{i18nString("income")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{i18nString("color")}</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    selectedColor === c
                      ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSave} disabled={isPending}>
            {isPending ? <><ButtonSpinner />{i18nString("saving")}</> : i18nString("saveCategory")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
