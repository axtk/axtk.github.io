import { escapeRegExp } from "./escapeRegExp";

const htmlEntityMap: [string, string][] = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
];

export function escapeHTML(x: unknown): string {
  let s = String(x);

  if (!x) return "";

  for (let [character, htmlEntity] of htmlEntityMap)
    s = s.replace(new RegExp(escapeRegExp(character), "g"), htmlEntity);

  return s;
}
