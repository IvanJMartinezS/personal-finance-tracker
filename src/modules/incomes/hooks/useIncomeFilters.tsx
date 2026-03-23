import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Income, Category } from '../utils/types';

interface UseIncomeFiltersProps {
  incomes: Income[];
  categories: Category[];
}

export const useIncomeFilters = ({ incomes }: UseIncomeFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const filterCategory = searchParams.get('category') || 'all';
  const filterCurrency = searchParams.get('currency') || 'all';
  const filterMonth = searchParams.get('month') || 'all';

  const setSearchQuery = (value: string) => {
    setSearchParams(prev => {
      if (value) prev.set('q', value);
      else prev.delete('q');
      return prev;
    });
  };

  const setFilterCategory = (value: string) => {
    setSearchParams(prev => {
      if (value !== 'all') prev.set('category', value);
      else prev.delete('category');
      return prev;
    });
  };

  const setFilterCurrency = (value: string) => {
    setSearchParams(prev => {
      if (value !== 'all') prev.set('currency', value);
      else prev.delete('currency');
      return prev;
    });
  };

  const setFilterMonth = (value: string) => {
    setSearchParams(prev => {
      if (value !== 'all') prev.set('month', value);
      else prev.delete('month');
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => {
      const matchesSearch = (income.source)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === 'all' || income.category_id === filterCategory;

      const matchesCurrency = filterCurrency === 'all' || income.currency === filterCurrency;

      let matchesMonth = filterMonth === 'all';
      if (!matchesMonth) {
        const incomeMonth = new Date(income.date + 'T12:00:00').getMonth() + 1;
        matchesMonth = incomeMonth.toString() === filterMonth;
      }

      return matchesSearch && matchesCategory && matchesCurrency && matchesMonth;
    });
  }, [incomes, searchQuery, filterCategory, filterCurrency, filterMonth]);

  const totalFiltered = useMemo(() => {
    return filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount_in_base), 0);
  }, [filteredIncomes]);

  return {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    filteredIncomes,
    totalFiltered,
    clearFilters,
  };
};