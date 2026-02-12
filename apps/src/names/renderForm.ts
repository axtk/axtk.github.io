import type { Context } from "./Context.ts";

export function renderForm({ q }: Context) {
  document.querySelector<HTMLInputElement>('.input [name="q"]')!.value = q;
}
