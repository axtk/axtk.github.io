import type { Context } from "./Context";

export function getAbbrHTML(key: string, { data: { abbrs } }: Context) {
  if (!abbrs || !(key in abbrs)) return `<abbr>${key}</abbr>`;

  let { d: title, t: value, g: group, s: style } = abbrs[key];
  let content = value ?? key;
  let groupAttr = group ? ` data-group="${group}"` : "";

  switch (style) {
    case "i":
      return `<i>${content}</i>`;
    case "regular":
      return content;
    default:
      return `<abbr title="${title}"${groupAttr}>${content}</abbr>`;
  }
}
