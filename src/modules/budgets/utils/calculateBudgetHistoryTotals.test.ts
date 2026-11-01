import { describe, expect, it } from "vitest";
import { calculateBudgetHistoryTotals } from "./calculateBudgetHistoryTotals";
import type { CategoryBudgetHistory } from "./calculateBudgetHistory";
import type { Budget } from "@/types";

function history(entries: CategoryBudgetHistory["entries"]): CategoryBudgetHistory {
  return { budget: {} as Budget, entries };
}

describe("calculateBudgetHistoryTotals", () => {
  it("suma el disponible y el acumulado de todas las categorías por mes", () => {
    const data = [
      history([
        { month: 1, spentUSD: 20, remainingUSD: 10, accumulatedUSD: 10 },
        { month: 2, spentUSD: 15, remainingUSD: 15, accumulatedUSD: 25 },
      ]),
      history([
        { month: 1, spentUSD: 5, remainingUSD: 45, accumulatedUSD: 45 },
        { month: 2, spentUSD: 10, remainingUSD: 40, accumulatedUSD: 85 },
      ]),
    ];

    const totals = calculateBudgetHistoryTotals(data, [1, 2]);

    expect(totals).toEqual([
      { month: 1, remainingUSD: 55, accumulatedUSD: 55 },
      { month: 2, remainingUSD: 55, accumulatedUSD: 110 },
    ]);
  });

  it("una categoría sin entrada ese mes no aporta (no cuenta como 0)", () => {
    const data = [
      history([{ month: 3, spentUSD: 0, remainingUSD: 100, accumulatedUSD: 100 }]), // arrancó en marzo
      history([
        { month: 1, spentUSD: 0, remainingUSD: 50, accumulatedUSD: 50 },
        { month: 2, spentUSD: 0, remainingUSD: 50, accumulatedUSD: 100 },
        { month: 3, spentUSD: 0, remainingUSD: 50, accumulatedUSD: 150 },
      ]),
    ];

    const totals = calculateBudgetHistoryTotals(data, [1, 2, 3]);

    expect(totals).toEqual([
      { month: 1, remainingUSD: 50, accumulatedUSD: 50 },
      { month: 2, remainingUSD: 50, accumulatedUSD: 100 },
      { month: 3, remainingUSD: 150, accumulatedUSD: 250 },
    ]);
  });

  it("devuelve cero en todos los meses sin presupuestos", () => {
    expect(calculateBudgetHistoryTotals([], [1, 2])).toEqual([
      { month: 1, remainingUSD: 0, accumulatedUSD: 0 },
      { month: 2, remainingUSD: 0, accumulatedUSD: 0 },
    ]);
  });
});
