// src/lib/mock-data.ts
// Datos mock que imitan la estructura real de Supabase

export type Category = {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
};

export type Transaction = {
  id: string;
  user_id?: string; // opcional para mock
  date: string;
  category_id: string;
  item: string; // "item" para gastos, "source" para ingresos
  amount: number;
  currency: 'COP' | 'USD' | 'VES';
  exchange_rate: number;
  amount_in_base: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  source?: string;
  categories: {
    name: string;
    type: 'expense' | 'income';
    color: string;
  };
};

export const CURRENCIES = [
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'USD', symbol: 'US$', name: 'Dólar estadounidense' },
  { code: 'VES', symbol: 'Bs.', name: 'Bolívar venezolano' },
] as const;

// Categorías de ejemplo (coinciden con las usadas en los gastos)
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Viveres', type: 'expense', color: '#10b981' },
  { id: 'cat2', name: 'Transporte', type: 'expense', color: '#f59e0b' },
  { id: 'cat3', name: 'Servicios', type: 'expense', color: '#6366f1' },
  { id: 'cat4', name: 'Entretenimiento', type: 'expense', color: '#ec4899' },
  { id: 'cat5', name: 'Salud', type: 'expense', color: '#14b8a6' },
  { id: 'cat6', name: 'Educación', type: 'expense', color: '#8b5cf6' },
  { id: 'cat7', name: 'Hogar', type: 'expense', color: '#f97316' },
  { id: 'cat8', name: 'Salario', type: 'income', color: '#22c55e' },
  { id: 'cat9', name: 'Freelance', type: 'income', color: '#3b82f6' },
  { id: 'cat10', name: 'Inversiones', type: 'income', color: '#a855f7' },
];

// Gastos de ejemplo con estructura anidada
export const mockExpenses: Transaction[] = [
  {
    id: 'exp1',
    date: '2026-02-18',
    category_id: 'cat1',
    item: 'Bodega',
    amount: 74000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 74000,
    notes: 'Papel, Leche x2, cereal x2, galleta taco 7 y galletas varias x3.',
    categories: { name: 'Viveres', type: 'expense', color: '#10b981' }
  },
  {
    id: 'exp2',
    date: '2026-02-17',
    category_id: 'cat2',
    item: 'Gasolina',
    amount: 75000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 75000,
    categories: { name: 'Transporte', type: 'expense', color: '#f59e0b' }
  },
  {
    id: 'exp3',
    date: '2026-02-16',
    category_id: 'cat3',
    item: 'Internet ETB',
    amount: 89000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 89000,
    categories: { name: 'Servicios', type: 'expense', color: '#6366f1' }
  },
  {
    id: 'exp4',
    date: '2026-02-15',
    category_id: 'cat4',
    item: 'Netflix',
    amount: 12.99,
    currency: 'USD',
    exchange_rate: 4200,
    amount_in_base: 54558,
    categories: { name: 'Entretenimiento', type: 'expense', color: '#ec4899' }
  },
  {
    id: 'exp5',
    date: '2026-02-14',
    category_id: 'cat1',
    item: 'Restaurante',
    amount: 120000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 120000,
    categories: { name: 'Viveres', type: 'expense', color: '#10b981' }
  },
  {
    id: 'exp6',
    date: '2026-02-13',
    category_id: 'cat5',
    item: 'Farmacia',
    amount: 45000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 45000,
    categories: { name: 'Salud', type: 'expense', color: '#14b8a6' }
  },
  {
    id: 'exp7',
    date: '2026-02-12',
    category_id: 'cat7',
    item: 'Reparación lavadora',
    amount: 250000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 250000,
    categories: { name: 'Hogar', type: 'expense', color: '#f97316' }
  },
  {
    id: 'exp8',
    date: '2026-02-10',
    category_id: 'cat6',
    item: 'Curso Udemy',
    amount: 14.99,
    currency: 'USD',
    exchange_rate: 4200,
    amount_in_base: 62958,
    categories: { name: 'Educación', type: 'expense', color: '#8b5cf6' }
  },
  {
    id: 'exp9',
    date: '2026-02-08',
    category_id: 'cat1',
    item: 'Mercado semanal',
    amount: 210000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 210000,
    categories: { name: 'Viveres', type: 'expense', color: '#10b981' }
  },
  {
    id: 'exp10',
    date: '2026-02-05',
    category_id: 'cat2',
    item: 'Uber',
    amount: 32000,
    currency: 'COP',
    exchange_rate: 1,
    amount_in_base: 32000,
    categories: { name: 'Transporte', type: 'expense', color: '#f59e0b' }
  }
];

// Ingresos de ejemplo (similar estructura)
// src/lib/mock-data.ts (fragmento de incomes actualizado)

export const mockIncomes: Transaction[] = [
  {
    id: "51847a7e-05b7-41d2-9906-89abd6da47b2",
    user_id: "e84cf720-eef8-48e6-89bd-0608abede560",
    date: "2026-02-28",
    category_id: "cat8",
    item: "Sueldo",
    source: "Sueldo",
    amount: 100,
    currency: "USD",
    exchange_rate: 3700,
    amount_in_base: 370000,
    notes: "Sueldo Enero",
    created_at: "2026-02-28T00:24:09.322864+00:00",
    updated_at: "2026-02-28T00:24:09.322864+00:00",
    categories: {
      name: "Sueldo",
      type: "income",
      color: "#10b981"
    }
  },
  {
    id: "a257595a-68a6-4b3d-812c-0d91e2f430e5",
    user_id: "e84cf720-eef8-48e6-89bd-0608abede560",
    date: "2026-02-28",
    category_id: "cat8",
    item: "Sueldo",
    amount: 4000,
    currency: "VES",
    exchange_rate: 7,
    amount_in_base: 28000,
    notes: "Sueldo Febrero",
    source: "Sueldo",
    created_at: "2026-02-28T00:24:42.518957+00:00",
    updated_at: "2026-02-28T00:24:42.518957+00:00",
    categories: {
      name: "Sueldo",
      type: "income",
      color: "#10b981"
    }
  },
  {
    id: "e6d76b6c-3c06-4e4d-92bb-630a4790d35d",
    user_id: "e84cf720-eef8-48e6-89bd-0608abede560",
    date: "2026-02-28",
    category_id: "cat8",
    item: "Sueldo",
    source: "Sueldo",
    amount: 100000,
    currency: "COP",
    exchange_rate: 1,
    amount_in_base: 100000,
    notes: "Sueldo Marzo",
    created_at: "2026-02-28T00:25:14.624189+00:00",
    updated_at: "2026-02-28T00:25:14.624189+00:00",
    categories: {
      name: "Sueldo",
      type: "income",
      color: "#10b981"
    }
  }
];

// Datos para gráficos (mensual y por categoría)
export const monthlyData = [
  { month: 'Mar', ingresos: 6200000, gastos: 3800000 },
  { month: 'Abr', ingresos: 5800000, gastos: 4100000 },
  { month: 'May', ingresos: 7100000, gastos: 3500000 },
  { month: 'Jun', ingresos: 5500000, gastos: 4200000 },
  { month: 'Jul', ingresos: 6800000, gastos: 3900000 },
  { month: 'Ago', ingresos: 5900000, gastos: 4500000 },
  { month: 'Sep', ingresos: 6300000, gastos: 3700000 },
  { month: 'Oct', ingresos: 7500000, gastos: 4000000 },
  { month: 'Nov', ingresos: 6100000, gastos: 4800000 },
  { month: 'Dic', ingresos: 8200000, gastos: 5200000 },
  { month: 'Ene', ingresos: 6000000, gastos: 3600000 },
  { month: 'Feb', ingresos: 9490000, gastos: 1123516 },
];

export const categoryExpenseData = [
  { name: 'Viveres', value: 404000, color: '#10b981' },
  { name: 'Transporte', value: 107000, color: '#f59e0b' },
  { name: 'Servicios', value: 89000, color: '#6366f1' },
  { name: 'Entretenimiento', value: 54558, color: '#ec4899' },
  { name: 'Salud', value: 45000, color: '#14b8a6' },
  { name: 'Educación', value: 62958, color: '#8b5cf6' },
  { name: 'Hogar', value: 250000, color: '#f97316' },
];

// Funciones de formato (ya las tienes)
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatCurrency(amount: number, currency: string): string {
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$';
  if (currency === 'COP') {
    return `${sym}${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)}`;
  }
  return `${sym}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find(c => c.id === id);
}

export function getMockExpenses() {
  return mockExpenses;
}