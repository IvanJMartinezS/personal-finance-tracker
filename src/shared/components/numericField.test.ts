import { describe, expect, it } from "vitest";
import type { ChangeEvent } from "react";
import { numericInputValue, parseNumericInput } from "./numericField";

function changeEvent(value: string, valueAsNumber: number): ChangeEvent<HTMLInputElement> {
  return { target: { value, valueAsNumber } } as unknown as ChangeEvent<HTMLInputElement>;
}

describe("parseNumericInput", () => {
  it("returns NaN (not undefined) when the input is cleared", () => {
    // NaN, not undefined, because react-hook-form's Controller ignores
    // field.onChange(undefined) — it never re-renders, so the input gets
    // stuck showing its previous value and can't be cleared to retype.
    expect(parseNumericInput(changeEvent("", NaN))).toBeNaN();
  });

  it("returns the parsed number for a normal value", () => {
    expect(parseNumericInput(changeEvent("80", 80))).toBe(80);
  });
});

describe("numericInputValue", () => {
  it("renders NaN as an empty string", () => {
    expect(numericInputValue(NaN)).toBe("");
  });

  it("renders an unset value as an empty string", () => {
    expect(numericInputValue(undefined)).toBe("");
  });

  it("renders a real number as-is, including zero", () => {
    expect(numericInputValue(80)).toBe(80);
    expect(numericInputValue(0)).toBe(0);
  });
});
