// Single source of truth for all shared types

export interface Category {
  id: string;
  user_id?: string;
  name: string;
  type: string;
  color: string;
  created_at?: string;
  updated_at?: string;
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

/**
 * Ajuste del monto de un presupuesto vigente desde `year`/`month` en
 * adelante (hasta el siguiente ajuste, si lo hay) — ver
 * 009_create_budget_monthly_amounts.sql. Permite cambiar el monto de un
 * presupuesto sin reescribir los meses que ya pasaron.
 */
export interface BudgetMonthlyAmount {
  year: number;
  month: number;
  amount_usd: number;
}

/**
 * Presupuesto mensual objetivo por categoría de gasto, siempre en USD.
 * Un solo registro por (user_id, category_id) — ver 005_create_budgets.sql.
 * `amount_usd` es el monto ACTUAL (el que rige desde el ajuste más reciente
 * en adelante); `budget_monthly_amounts`, si viene incluido en la consulta,
 * trae el historial de ajustes para resolver el monto que regía en un mes
 * pasado — ver `resolveBudgetAmountForMonth`.
 */
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount_usd: number;
  created_at: string;
  updated_at: string;
  categories: Category | null;
  budget_monthly_amounts?: BudgetMonthlyAmount[];
}

export type CreateBudgetInput = Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'categories' | 'budget_monthly_amounts'>;
