import type { Context } from "./Context.ts";
import { getDimensions } from "./getDimensions.ts";

const maxWidth = 240;

export function setMenu(
  x: number,
  y: number,
  content: DocumentFragment,
  ctx: Context,
) {
  let { width, height } = getDimensions(ctx);
  let menu = document.querySelector<HTMLDivElement>("#screenmenu");

  if (!menu) {
    menu = document.createElement("div");
    menu.id = "screenmenu";
    ctx.element.parentElement?.appendChild(menu);
  }

  if (content.children.length === 0) {
    menu.classList.add("hidden");
    return;
  }

  menu.innerHTML = "";
  menu.style.width = "";

  menu.append(content);
  menu.classList.remove("hidden");

  let { width: w, height: h } = menu.getBoundingClientRect();

  if (w > maxWidth) {
    menu.style.width = `${maxWidth}px`;
    menu.classList.add("wide");
    w = maxWidth;
  } else menu.classList.remove("wide");

  let menuX = Math.min(x + 4, width - w - 6);
  let menuY = Math.min(y + 4, height - h - 6);

  menu.style.setProperty("--x", `${menuX}px`);
  menu.style.setProperty("--y", `${menuY}px`);
}
