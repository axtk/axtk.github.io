import type { Context } from "./Context";

export function renderForm({ q }: Context) {
  document.querySelector<HTMLInputElement>('.input [name="q"]')!.value = q;
}
