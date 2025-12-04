import { escapeRegExp } from "../_utils/escapeRegExp";
import { characterMap } from "./characterMap";

export function translit(x: string) {
  let s = x;

  for (let [key, value] of Object.entries(characterMap)) {
    if (s.includes(key))
      s = s.replace(new RegExp(escapeRegExp(key), "g"), value);
  }

  return s;
}
