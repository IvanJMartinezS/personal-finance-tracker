import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterConfig } from '@/shared/components/Filters';
import type { Category, Currency, Month } from '@/types';
import { CURRENCIES, MONTHS } from '@/lib/mock-data';
import { getSelectableYears } from '@/lib/dateUtils';

interface UseListFilterConfigsParams {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterCurrency: string;
  setFilterCurrency: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  filterYear: string;
  setFilterYear: (value: string) => void;
  categories: Category[];
}

export const useListFilterConfigs = ({
  filterCategory,
  setFilterCategory,
  filterCurrency,
  setFilterCurrency,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  categories,
}: UseListFilterConfigsParams) => {
  const { t } = useTranslation();

  return useMemo<FilterConfig[]>(
    () => [
      {
        id: 'category',
        label: t('filters.category'),
        value: filterCategory,
        onChange: setFilterCategory,
        options: categories,
        placeholder: t('filters.category'),
        allLabel: t('filters.allCategories'),
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
        label: t('filters.currency'),
        value: filterCurrency,
        onChange: setFilterCurrency,
        options: CURRENCIES,
        placeholder: t('filters.currency'),
        allLabel: t('filters.allCurrencies'),
        getOptionKey: (cur: Currency) => cur.code,
        getOptionValue: (cur: Currency) => cur.code,
        renderOption: (cur: Currency) => <>{cur.code}</>,
        className: 'w-[120px]',
      },
      {
        id: 'year',
        label: t('filters.year'),
        value: filterYear,
        onChange: setFilterYear,
        options: getSelectableYears(),
        placeholder: t('filters.year'),
        allLabel: t('filters.allYears'),
        getOptionKey: (y: number) => String(y),
        getOptionValue: (y: number) => String(y),
        renderOption: (y: number) => <>{y}</>,
        className: 'w-[100px]',
      },
      {
        id: 'month',
        label: t('filters.month'),
        value: filterMonth,
        onChange: setFilterMonth,
        options: MONTHS,
        placeholder: t('filters.month'),
        allLabel: t('filters.allMonths'),
        getOptionKey: (m: Month) => m.value,
        getOptionValue: (m: Month) => m.value,
        renderOption: (m: Month) => <>{m.item}</>,
        className: 'w-[120px]',
      },
    ],
    [filterCategory, setFilterCategory, filterCurrency, setFilterCurrency, filterMonth, setFilterMonth, filterYear, setFilterYear, categories, t]
  );
};
