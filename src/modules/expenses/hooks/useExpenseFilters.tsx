import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Expense, Category } from '../utils/types'; 

interface UseExpenseFiltersProps {
  expenses: Expense[];
  categories: Category[]; 
}

export const useExpenseFilters = ({ expenses }: UseExpenseFiltersProps) => {
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

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.item.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === 'all' || expense.category_id === filterCategory;

      const matchesCurrency = filterCurrency === 'all' || expense.currency === filterCurrency;

      let matchesMonth = filterMonth === 'all';
      if (!matchesMonth) {
        const expenseMonth = new Date(expense.date + 'T12:00:00').getMonth() + 1; 
        matchesMonth = expenseMonth.toString() === filterMonth;
      }

      return matchesSearch && matchesCategory && matchesCurrency && matchesMonth;
    });
  }, [expenses, searchQuery, filterCategory, filterCurrency, filterMonth]);

  const totalFiltered = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount_in_base), 0);
  }, [filteredExpenses]);

  return {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterCurrency,
    setFilterCurrency,
    filterMonth,
    setFilterMonth,
    filteredExpenses,
    totalFiltered,
    clearFilters,
  };
};