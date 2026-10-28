import { describe, expect, it } from "vitest";
import { buildBudgetAmountUpdates } from "./buildBudgetAmountUpdates";
import type { Budget } from "@/types";

function budget(amount_usd: number, created_at: string, budget_monthly_amounts: Budget["budget_monthly_amounts"] = []): Pick<Budget, "created_at" | "amount_usd" | "budget_monthly_amounts"> {
  return { amount_usd, created_at, budget_monthly_amounts };
}

describe("buildBudgetAmountUpdates", () => {
  it("primera edición: ancla el monto original al mes de creación y el nuevo al mes actual", () => {
    const b = budget(220, "2026-01-15T00:00:00Z");
    const updates = buildBudgetAmountUpdates(b, 240, new Date("2026-11-05T00:00:00Z"));

    expect(updates).toEqual([
      { year: 2026, month: 1, amount_usd: 220 },
      { year: 2026, month: 11, amount_usd: 240 },
    ]);
  });

  it("si se crea y se edita en el mismo mes, no hace falta anclar el original por separado", () => {
    const b = budget(220, "2026-11-03T00:00:00Z");
    const updates = buildBudgetAmountUpdates(b, 240, new Date("2026-11-20T00:00:00Z"));

    expect(updates).toEqual([{ year: 2026, month: 11, amount_usd: 240 }]);
  });

  it("si ya tenía ediciones previas, solo actualiza el mes actual", () => {
    const b = budget(220, "2026-01-15T00:00:00Z", [
      { year: 2026, month: 1, amount_usd: 200 },
      { year: 2026, month: 9, amount_usd: 220 },
    ]);
    const updates = buildBudgetAmountUpdates(b, 240, new Date("2026-11-05T00:00:00Z"));

    expect(updates).toEqual([{ year: 2026, month: 11, amount_usd: 240 }]);
  });

  it("si se edita dos veces el mismo mes, solo genera la fila de ese mes (la segunda sobrescribe)", () => {
    const b = budget(220, "2026-01-15T00:00:00Z");
    const updates = buildBudgetAmountUpdates(b, 230, new Date("2026-01-20T00:00:00Z"));

    expect(updates).toEqual([{ year: 2026, month: 1, amount_usd: 230 }]);
  });
});
