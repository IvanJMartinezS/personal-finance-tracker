import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

interface YearFilterProps {
  year: number;
  years: number[];
  onChange: (year: number) => void;
  className?: string;
}

export const YearFilter = ({ year, years, onChange, className }: YearFilterProps) => (
  <Select value={String(year)} onValueChange={(v) => onChange(Number(v))}>
    <SelectTrigger className={className ?? "w-[100px]"}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {years.map((y) => (
        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);
