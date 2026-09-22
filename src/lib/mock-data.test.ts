import { describe, expect, it } from 'vitest';
import {
  calculateAmountInBaseUSD,
  formatOtherCurrencyEquivalent,
  REFERENCE_USD_TO_COP_RATE,
  toCopEquivalent,
  toUsdEquivalent,
} from './mock-data';

describe('calculateAmountInBaseUSD', () => {
  it('para USD, el monto base es el mismo monto ingresado (es la moneda base)', () => {
    expect(calculateAmountInBaseUSD(100, 'USD', undefined)).toBe(100);
  });

  it('para otra moneda (p. ej. COP), divide entre la tasa dada (COP por USD)', () => {
    // 400,000 COP a una tasa de 4,000 COP por USD = 100 USD
    expect(calculateAmountInBaseUSD(400000, 'COP', 4000)).toBe(100);
  });

  it('usa 1 como tasa si no se provee ninguna (evita dividir por cero/undefined)', () => {
    expect(calculateAmountInBaseUSD(50, 'COP', undefined)).toBe(50);
  });
});

describe('toUsdEquivalent', () => {
  it('devuelve amount_in_base directamente — ya es la moneda base', () => {
    expect(toUsdEquivalent({ amount_in_base: 123.45 })).toBe(123.45);
  });
});

describe('toCopEquivalent', () => {
  it('para un gasto registrado en COP, usa el monto original (exacto)', () => {
    expect(toCopEquivalent({ currency: 'COP', amount: 400000, amount_in_base: 100 })).toBe(400000);
  });

  it('para un gasto en USD sin tasa específica (guardada como 1), estima con la tasa de referencia', () => {
    expect(toCopEquivalent({ currency: 'USD', amount: 100, amount_in_base: 100, exchange_rate: 1 }))
      .toBe(100 * REFERENCE_USD_TO_COP_RATE);
  });

  it('sin exchange_rate provisto, también estima con la tasa de referencia', () => {
    expect(toCopEquivalent({ currency: 'USD', amount: 100, amount_in_base: 100 }))
      .toBe(100 * REFERENCE_USD_TO_COP_RATE);
  });

  it('para un gasto en USD con una tasa específica dada, usa esa tasa para un valor exacto', () => {
    // Este es justo el caso que se pidió: registrar en USD pero poder dar la
    // tasa de ese día para que el equivalente en COP no sea una estimación.
    expect(toCopEquivalent({ currency: 'USD', amount: 100, amount_in_base: 100, exchange_rate: 3850 }))
      .toBe(385000);
  });
});

describe('formatOtherCurrencyEquivalent', () => {
  it('para un gasto en USD, muestra su equivalente en COP', () => {
    // 4.22 USD * 3700 ≈ $15.614 COP
    const result = formatOtherCurrencyEquivalent({ currency: 'USD', amount: 4.22, amount_in_base: 4.22 });
    expect(result).toContain('15.614');
  });

  it('para un gasto en COP, muestra su equivalente en USD', () => {
    const result = formatOtherCurrencyEquivalent({ currency: 'COP', amount: 400000, amount_in_base: 100 });
    expect(result).toBe('US$100.00');
  });
});
