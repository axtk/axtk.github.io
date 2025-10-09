import type { Context } from "../Context";
import type { ViewItem } from "../ViewItem";

export function getDisplayedDate({ name }: ViewItem, ctx: Context) {
  if (!name) return;

  let s = name.replace(/(^[^\d]+_|\.\w+$)/g, "").split(/[-_]/);
  let m = s[0]?.match(/^(\d{4})[-_]?(\d\d)?[-_]?(\d\d)?$/);

  if (!m || m.length < 2) return;

  return m
    .slice(1, ctx.dateFormat === "short" ? 3 : 4)
    .filter((x) => x !== undefined)
    .join("-");
}
