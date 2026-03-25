// Business constants and formatting utilities

export const CURRENCIES = [
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'USD', symbol: 'US$', name: 'Dólar estadounidense' },
  { code: 'VES', symbol: 'Bs.', name: 'Bolívar venezolano' },
] as const;

export const MONTHS = [
  { item: 'Enero', value: '1' },
  { item: 'Febrero', value: '2' },
  { item: 'Marzo', value: '3' },
  { item: 'Abril', value: '4' },
  { item: 'Mayo', value: '5' },
  { item: 'Junio', value: '6' },
  { item: 'Julio', value: '7' },
  { item: 'Agosto', value: '8' },
  { item: 'Septiembre', value: '9' },
  { item: 'Octubre', value: '10' },
  { item: 'Noviembre', value: '11' },
  { item: 'Diciembre', value: '12' },
] as const;

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrency(amount: number, currency: string): string {
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$';
  if (currency === 'COP') {
    return `${sym}${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)}`;
  }
  return `${sym}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}
