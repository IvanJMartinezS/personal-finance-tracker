import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseListFiltersParams<T> {
  items: T[];
  searchFn: (item: T, query: string) => boolean;
  categoryFn: (item: T) => string | null;
  currencyFn: (item: T) => string;
  dateFn: (item: T) => string;
  amountFn: (item: T) => number;
}

export const useListFilters = <T,>({
  items,
  searchFn,
  categoryFn,
  currencyFn,
  dateFn,
  amountFn,
}: UseListFiltersParams<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const filterCategory = searchParams.get('category') || 'all';
  const filterCurrency = searchParams.get('currency') || 'all';
  const filterMonth = searchParams.get('month') || 'all';
  const filterYear = searchParams.get('year') || 'all';

  const setSearchQuery = (value: string) => {
    setSearchParams(prev => { if (value) prev.set('q', value); else prev.delete('q'); return prev; });
  };
  const setFilterCategory = (value: string) => {
    setSearchParams(prev => { if (value !== 'all') prev.set('category', value); else prev.delete('category'); return prev; });
  };
  const setFilterCurrency = (value: string) => {
    setSearchParams(prev => { if (value !== 'all') prev.set('currency', value); else prev.delete('currency'); return prev; });
  };
  const setFilterMonth = (value: string) => {
    setSearchParams(prev => { if (value !== 'all') prev.set('month', value); else prev.delete('month'); return prev; });
  };
  const setFilterYear = (value: string) => {
    setSearchParams(prev => { if (value !== 'all') prev.set('year', value); else prev.delete('year'); return prev; });
  };
  const clearFilters = () => setSearchParams({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchFn(item, searchQuery);
      const matchesCategory = filterCategory === 'all' || categoryFn(item) === filterCategory;
      const matchesCurrency = filterCurrency === 'all' || currencyFn(item) === filterCurrency;
      let matchesMonth = filterMonth === 'all';
      let matchesYear = filterYear === 'all';
      if (!matchesMonth || !matchesYear) {
        const itemDate = new Date(dateFn(item) + 'T12:00:00');
        matchesMonth ||= (itemDate.getMonth() + 1).toString() === filterMonth;
        matchesYear ||= itemDate.getFullYear().toString() === filterYear;
      }
      return matchesSearch && matchesCategory && matchesCurrency && matchesMonth && matchesYear;
    });
  }, [items, searchQuery, filterCategory, filterCurrency, filterMonth, filterYear]);

  const totalFiltered = useMemo(
    () => filteredItems.reduce((sum, item) => sum + amountFn(item), 0),
    [filteredItems]
  );

  return {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    filterYear, setFilterYear,
    filteredItems, totalFiltered,
    clearFilters,
  };
};
