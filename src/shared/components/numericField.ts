import type { ChangeEvent } from "react";

/**
 * react-hook-form's `Controller` silently ignores `field.onChange(undefined)`
 * — it doesn't update the field or re-render, so a controlled `<input
 * type="number">` bound to `field.value` gets stuck showing its last numeric
 * value and can't be cleared to retype a new one (reproduced in
 * `useController`: calling onChange with `undefined` never triggers a
 * render). `NaN` does propagate correctly, so it's used here as the "empty"
 * sentinel instead — Zod's `z.number()` already rejects `NaN` with the same
 * invalid/required validation as before.
 */
export function parseNumericInput(e: ChangeEvent<HTMLInputElement>): number {
  return e.target.value === "" ? NaN : e.target.valueAsNumber;
}

/** Value to render in the input: NaN (or no value yet) shows as empty instead of the literal "NaN" string. */
export function numericInputValue(value: number | undefined): number | string {
  return value === undefined || Number.isNaN(value) ? "" : value;
}
