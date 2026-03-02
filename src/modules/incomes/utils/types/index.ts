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

interface Category{
  name: string;
  type: string;
  color: string;
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

export type CreateIncomeInput = Omit<Income, 'id' | 'created_at' | 'updated_at' | 'categories'>;