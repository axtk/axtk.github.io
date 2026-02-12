import type { Context } from "./Context.ts";

function setSelectValue(element: HTMLSelectElement, value: unknown) {
  let stringValue = String(value);
  let options = element.querySelectorAll("option");
  let selected = false;

  for (let option of options) {
    if (option.value === stringValue || option.textContent === stringValue) {
      option.setAttribute("selected", "selected");
      selected = true;
    } else option.removeAttribute("selected");
  }

  if (!selected) {
    let option = document.createElement("option");
    option.textContent = stringValue;
    option.setAttribute("selected", "selected");
    element.prepend(option);
  }
}

let inited = false;

export function renderForm(ctx: Context) {
  if (inited) return;

  let state = ctx.store.getState();
  let form = ctx.container.querySelector(".controlbar form")!;
  let select = (name: string): HTMLSelectElement =>
    form.querySelector(`select[name="${name}"]`)!;

  setSelectValue(select("x"), state.cellValues[0]);
  setSelectValue(select("o"), state.cellValues[1]);
  setSelectValue(select("rows"), state.rows);
  setSelectValue(select("columns"), state.columns);
  setSelectValue(select("win"), state.winLength);

  inited = true;
}
