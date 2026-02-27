import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

type FilterProps<T> = {
  value: string;
  onValueChange: (v: string) => void;
  items: readonly T[];
  placeholder?: string;
  className?: string;
  allLabel?: string;
  getKey: (item: T) => string;
  getValue: (item: T) => string;
  renderLabel: (item: T) => React.ReactNode;
};

export const Filter = <T,>({
  value,
  onValueChange,
  items,
  placeholder,
  className,
  allLabel = "Todas",
  getKey,
  getValue,
  renderLabel,
}: FilterProps<T>) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {items.map(item => (
          <SelectItem key={getKey(item)} value={getValue(item)}>
            {renderLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
