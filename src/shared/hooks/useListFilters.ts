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

  const setSearchQuery = (value: string) => {
    setSearchParams(prev => { value ? prev.set('q', value) : prev.delete('q'); return prev; });
  };
  const setFilterCategory = (value: string) => {
    setSearchParams(prev => { value !== 'all' ? prev.set('category', value) : prev.delete('category'); return prev; });
  };
  const setFilterCurrency = (value: string) => {
    setSearchParams(prev => { value !== 'all' ? prev.set('currency', value) : prev.delete('currency'); return prev; });
  };
  const setFilterMonth = (value: string) => {
    setSearchParams(prev => { value !== 'all' ? prev.set('month', value) : prev.delete('month'); return prev; });
  };
  const clearFilters = () => setSearchParams({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchFn(item, searchQuery);
      const matchesCategory = filterCategory === 'all' || categoryFn(item) === filterCategory;
      const matchesCurrency = filterCurrency === 'all' || currencyFn(item) === filterCurrency;
      let matchesMonth = filterMonth === 'all';
      if (!matchesMonth) {
        const month = new Date(dateFn(item) + 'T12:00:00').getMonth() + 1;
        matchesMonth = month.toString() === filterMonth;
      }
      return matchesSearch && matchesCategory && matchesCurrency && matchesMonth;
    });
  }, [items, searchQuery, filterCategory, filterCurrency, filterMonth]);

  const totalFiltered = useMemo(
    () => filteredItems.reduce((sum, item) => sum + amountFn(item), 0),
    [filteredItems]
  );

  return {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterCurrency, setFilterCurrency,
    filterMonth, setFilterMonth,
    filteredItems, totalFiltered,
    clearFilters,
  };
};
