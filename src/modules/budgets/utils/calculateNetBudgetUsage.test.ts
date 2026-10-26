import { describe, expect, it } from "vitest";
import { calculateNetBudgetUsage } from "./calculateNetBudgetUsage";
import type { BudgetWithUsage } from "../hooks/useBudgetsUsage";
import type { Budget } from "@/types";

function usage(amountUsd: number, spentUSD: number): BudgetWithUsage {
  const budget = { id: amountUsd + "-" + spentUSD, amount_usd: amountUsd } as Budget;
  const remainingUSD = amountUsd - spentUSD;
  return {
    budget,
    spentUSD,
    remainingUSD,
    percentUsed: amountUsd > 0 ? (spentUSD / amountUsd) * 100 : 0,
    percentAvailable: amountUsd > 0 ? 100 - (spentUSD / amountUsd) * 100 : 100,
  };
}

describe("calculateNetBudgetUsage", () => {
  it("suma todo el presupuesto y todo lo gastado, sin importar la categoría", () => {
    const result = calculateNetBudgetUsage([usage(200, 50), usage(100, 100)]);
    expect(result.totalBudgetUSD).toBe(300);
    expect(result.totalSpentUSD).toBe(150);
    expect(result.totalRemainingUSD).toBe(150);
  });

  it("queda en positivo aunque una categoría individual se haya pasado, si otras compensan", () => {
    // Mercado se pasó por $35, Potter tiene $39 de sobra -> en conjunto, bien.
    const result = calculateNetBudgetUsage([usage(230, 265), usage(50, 11)]);
    expect(result.totalRemainingUSD).toBe(4);
  });

  it("devuelve ceros con una lista vacía", () => {
    expect(calculateNetBudgetUsage([])).toEqual({
      totalBudgetUSD: 0,
      totalSpentUSD: 0,
      totalRemainingUSD: 0,
    });
  });
});
