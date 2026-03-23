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

export interface CreateIncome {
    date: string;
    category_id: string;
    source: string;
    amount: number;
    currency: string;
    exchange_rate: number;
    amount_in_base: number;
    user_id: string;
    notes?: string | null;
}

export interface Category {
  id: string;        
  name: string;
  color: string;
  type?: string;    
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
  exchange_rate: number;
  amount_in_base: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  categories: Category | null; 
}

export interface CreateExpense {
    date: string;
    category_id: string;
    item: string;
    amount: number;
    currency: string;
    exchange_rate: number;
    amount_in_base: number;
    user_id: string;
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'categories'>;

export type CreateIncomeInput = Omit<Income, 'id' | 'created_at' | 'updated_at' | 'categories'>;