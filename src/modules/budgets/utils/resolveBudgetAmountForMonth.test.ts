import { describe, expect, it } from "vitest";
import { resolveBudgetAmountForMonth } from "./resolveBudgetAmountForMonth";

describe("resolveBudgetAmountForMonth", () => {
  it("usa el monto por defecto cuando no hay ningún ajuste mensual", () => {
    expect(resolveBudgetAmountForMonth(220, [], 2026, 10)).toBe(220);
    expect(resolveBudgetAmountForMonth(220, undefined, 2026, 10)).toBe(220);
  });

  it("usa el monto por defecto para meses anteriores al primer ajuste registrado", () => {
    const amounts = [{ year: 2026, month: 11, amount_usd: 240 }];
    expect(resolveBudgetAmountForMonth(220, amounts, 2026, 10)).toBe(220);
  });

  it("un ajuste aplica desde su mes en adelante, incluyendo meses futuros sin ajuste propio", () => {
    const amounts = [{ year: 2026, month: 11, amount_usd: 240 }];
    expect(resolveBudgetAmountForMonth(220, amounts, 2026, 11)).toBe(240);
    expect(resolveBudgetAmountForMonth(220, amounts, 2026, 12)).toBe(240);
    expect(resolveBudgetAmountForMonth(220, amounts, 2027, 1)).toBe(240);
  });

  it("usa el ajuste más reciente que ya aplicaba, entre varios", () => {
    const amounts = [
      { year: 2026, month: 5, amount_usd: 200 },
      { year: 2026, month: 11, amount_usd: 240 },
      { year: 2026, month: 8, amount_usd: 220 },
    ];
    expect(resolveBudgetAmountForMonth(100, amounts, 2026, 7)).toBe(200);
    expect(resolveBudgetAmountForMonth(100, amounts, 2026, 9)).toBe(220);
    expect(resolveBudgetAmountForMonth(100, amounts, 2026, 11)).toBe(240);
  });

  it("no se confunde con el cambio de año (diciembre de un año vs enero del siguiente)", () => {
    const amounts = [{ year: 2025, month: 12, amount_usd: 150 }];
    expect(resolveBudgetAmountForMonth(100, amounts, 2026, 1)).toBe(150);
  });
});
