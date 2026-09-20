import type { Control, ControllerRenderProps, FieldValues, Path, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";

interface FormFieldProps<T extends FieldValues, Name extends Path<T>> {
  name: Name;
  label: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  children: (field: ControllerRenderProps<T, Name> & { id: string }) => React.ReactElement;
  className?: string;
}

export const FormField = <T extends FieldValues, Name extends Path<T>>({
  name,
  label,
  control,
  errors,
  children,
  className,
}: FormFieldProps<T, Name>) => {
  const error = errors[name];
  const errorId = `${String(name)}-error`;

  return (
    <div className={className}>
      <Label htmlFor={String(name)}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => children({ ...field, id: String(name) })}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}; 