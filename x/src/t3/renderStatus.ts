import type { Context } from "./Context.ts";
import { getStatus } from "./getStatus.ts";

export function renderStatus(ctx: Context) {
  document.documentElement.dataset.status = getStatus(ctx).value;
}
