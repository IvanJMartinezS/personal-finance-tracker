import { useMemo } from 'react';
import type { FilterConfig } from '@/shared/components/Filters';
import type { Category, Currency, Month } from '@/types';
import { CURRENCIES, MONTHS } from '@/lib/mock-data';

interface UseListFilterConfigsParams {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterCurrency: string;
  setFilterCurrency: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  categories: Category[];
}

export const useListFilterConfigs = ({
  filterCategory,
  setFilterCategory,
  filterCurrency,
  setFilterCurrency,
  filterMonth,
  setFilterMonth,
  categories,
}: UseListFilterConfigsParams) => {
  return useMemo<FilterConfig[]>(
    () => [
      {
        id: 'category',
        label: 'Categoría',
        value: filterCategory,
        onChange: setFilterCategory,
        options: categories,
        placeholder: 'Categoría',
        getOptionKey: (cat: Category) => cat.id,
        getOptionValue: (cat: Category) => cat.id,
        renderOption: (cat: Category) => (
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.name}
          </span>
        ),
        className: 'w-[160px]',
      },
      {
        id: 'currency',
        label: 'Moneda',
        value: filterCurrency,
        onChange: setFilterCurrency,
        options: CURRENCIES,
        placeholder: 'Moneda',
        getOptionKey: (cur: Currency) => cur.code,
        getOptionValue: (cur: Currency) => cur.code,
        renderOption: (cur: Currency) => <>{cur.code}</>,
        className: 'w-[120px]',
      },
      {
        id: 'month',
        label: 'Mes',
        value: filterMonth,
        onChange: setFilterMonth,
        options: MONTHS,
        placeholder: 'Mes',
        getOptionKey: (m: Month) => m.value,
        getOptionValue: (m: Month) => m.value,
        renderOption: (m: Month) => <>{m.item}</>,
        className: 'w-[120px]',
      },
    ],
    [filterCategory, setFilterCategory, filterCurrency, setFilterCurrency, filterMonth, setFilterMonth, categories]
  );
};
