import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { mockCategories } from "@/lib/mock-data";

const PRESET_COLORS = [
  "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6",
  "#8b5cf6", "#f97316", "#3b82f6", "#22c55e", "#a855f7",
  "#ef4444", "#06b6d4",
];

export const Categories = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const { data: categories, isLoading } = { data: mockCategories, isLoading: false };

  const expenseCats = categories?.filter(c => c.type === "expense") ?? [];
  const incomeCats = categories?.filter(c => c.type === "income") ?? [];

  const handleSave = () => {
    console.log("Saving category:", { name, type, color: selectedColor });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-muted-foreground">{(categories?.length ?? 0)} categorías configuradas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nueva categoría</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Nueva categoría</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Alimentación" />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Gasto</SelectItem>
                    <SelectItem value="income">Ingreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} className={`h-8 w-8 rounded-full transition-all ${selectedColor === c ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                Guardar categoría
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {[{ title: "Gastos", cats: expenseCats }, { title: "Ingresos", cats: incomeCats }].map(({ title, cats }) => (
        <Card key={title} className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {title} <Badge variant="secondary" className="text-xs">{cats.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {cats.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Sin categorías de {title.toLowerCase()}</p>
            ) : (
              <div className="divide-y divide-border">
                {cats.map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                    <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium flex-1">{cat.name}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar categoría "{cat.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>Los gastos/ingresos con esta categoría quedarán sin categoría asignada.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => console.log("Deleting category:", cat.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
