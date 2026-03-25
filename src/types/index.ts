// Single source of truth for all shared types

export interface Category {
  id: string;
  user_id?: string;
  name: string;
  type: string;
  color: string;
  created_at?: string;
}

export interface CreateCategory {
  name: string;
  type: string;
  color: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Month {
  item: string;
  value: string;
}

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  category_id: string | null;
  item: string;
  amount: number;
  currency: string;
  exchange_rate: number | undefined;
  amount_in_base: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  categories: Category | null;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'categories'>;

export interface Income {
  id: string;
  user_id: string;
  date: string;
  category_id: string | null;
  source: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  amount_in_base: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  categories: Category | null;
}

export type CreateIncomeInput = Omit<Income, 'id' | 'created_at' | 'updated_at' | 'categories'>;
