// Business constants and formatting utilities

/**
 * Todas las monedas que la app conoce para mostrar/formatear (incluye VES,
 * aunque ya no se puede elegir al crear un gasto/ingreso nuevo — se mantiene
 * aquí para que los registros históricos en VES se sigan mostrando bien).
 */
export const CURRENCIES = [
  { code: 'USD', symbol: 'US$', name: 'Dólar estadounidense' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'VES', symbol: 'Bs.', name: 'Bolívar venezolano' },
] as const;

/**
 * Monedas que se pueden elegir al crear/editar un gasto o ingreso. VES no
 * está disponible por ahora (sin uso actual) — se puede reactivar agregándola
 * de vuelta aquí más adelante, sin tocar los registros históricos que ya
 * existan en esa moneda.
 */
export const SELECTABLE_CURRENCIES = CURRENCIES.filter((c) => c.code !== 'VES');

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

/**
 * Tasa de referencia COP ↔ USD usada para estimar el equivalente de un monto
 * en la moneda contraria, cuando no se registró con una tasa propia (ver
 * `toCopEquivalent`). Es una aproximación fija, no la tasa de mercado en
 * tiempo real; centralizada aquí para no repetirla como número mágico en
 * cada módulo que la necesita.
 */
export const REFERENCE_USD_TO_COP_RATE = 3700;

/**
 * Monto de un gasto/ingreso en USD — la moneda base de la app (ver
 * 006_switch_base_currency_to_usd.sql): `amount_in_base` ya se guarda
 * siempre en USD, exacto para cualquier moneda de origen (para monedas
 * distintas de USD, exacto según la tasa que el usuario dio al registrarlo).
 * Se mantiene como función (en vez de leer `amount_in_base` directo) para
 * que el nombre deje explícita la intención en el sitio donde se usa, y para
 * tener un solo lugar que actualizar si la moneda base vuelve a cambiar.
 */
export function toUsdEquivalent(entry: { amount_in_base: number }): number {
  return Number(entry.amount_in_base);
}

/**
 * Equivalente en COP de un gasto/ingreso:
 * - Si se registró en COP, es su monto original (exacto).
 * - Si se registró en USD y se dio una tasa específica al crearlo (opcional,
 *   ver ExpenseForm/IncomeForm), se usa esa tasa para un valor exacto:
 *   `amount_in_base` ya es USD, así que `amount_in_base × tasa` da COP.
 * - Si no se dio tasa (el valor por defecto guardado es 1, y una tasa
 *   COP-por-USD real nunca es 1), se estima con la tasa de referencia.
 */
export function toCopEquivalent(entry: { currency: string; amount: number; amount_in_base: number; exchange_rate?: number | null }): number {
  if (entry.currency === "COP") return Number(entry.amount);
  const hasSpecificRate = entry.exchange_rate !== undefined && entry.exchange_rate !== null && entry.exchange_rate !== 1;
  const rate = hasSpecificRate ? entry.exchange_rate! : REFERENCE_USD_TO_COP_RATE;
  return Number(entry.amount_in_base) * rate;
}

/**
 * Calcula `amount_in_base` (siempre en USD) a partir de lo que el usuario
 * ingresó en el formulario de gasto/ingreso: si ya es USD, es el mismo monto;
 * si no (p. ej. COP), se convierte dividiendo por la tasa de cambio (COP por
 * USD) que el usuario dio. Centralizado para no repetir esta fórmula (y el
 * riesgo de invertirla por error) en cada diálogo de crear/editar.
 */
export function calculateAmountInBaseUSD(amount: number, currency: string, exchangeRate?: number | null): number {
  return currency === "USD" ? amount : amount / (exchangeRate || 1);
}

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

/**
 * Texto formateado (sin paréntesis) del equivalente en la "otra" moneda de
 * referencia: COP si el gasto/ingreso se registró en USD, USD en cualquier
 * otro caso — para mostrar como referencia bajo el monto principal en los
 * listados de gastos e ingresos.
 */
export function formatOtherCurrencyEquivalent(entry: { currency: string; amount: number; amount_in_base: number; exchange_rate?: number | null }): string {
  return entry.currency === 'USD'
    ? formatCOP(toCopEquivalent(entry))
    : formatCurrency(toUsdEquivalent(entry), 'USD');
}
