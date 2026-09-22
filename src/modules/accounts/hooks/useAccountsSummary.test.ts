import { describe, expect, it } from 'vitest';
import { toUSD } from './useAccountsSummary';

describe('toUSD', () => {
  it('para USD, devuelve el mismo monto sin necesitar tasa', () => {
    expect(toUSD(100, 'USD')).toBe(100);
  });

  it('para COP con una tasa específica, la usa para un valor exacto', () => {
    // Este es justo el caso pedido: 320.000 COP a 3.200 = 100 USD
    expect(toUSD(320000, 'COP', 3200)).toBe(100);
  });

  it('para COP sin tasa registrada, no hay forma confiable de convertir → null', () => {
    // Ya no se usa ninguna tasa fija de referencia para adivinarlo.
    expect(toUSD(1000, 'COP', null)).toBeNull();
    expect(toUSD(1000, 'COP', undefined)).toBeNull();
  });

  it('para otra moneda (p. ej. VES) con una tasa específica, la usa', () => {
    expect(toUSD(500, 'VES', 50)).toBe(10);
  });

  it('para otra moneda sin tasa conocida, no hay forma confiable de convertir → null', () => {
    expect(toUSD(500, 'VES', null)).toBeNull();
  });
});
