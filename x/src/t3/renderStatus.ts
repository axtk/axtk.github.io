import { Context } from "./Context";
import { getStatus } from "./getStatus";

export function renderStatus(ctx: Context) {
  document.documentElement.dataset.status = getStatus(ctx).value;
}
