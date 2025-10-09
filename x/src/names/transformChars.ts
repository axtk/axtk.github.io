import type { Chars, RawChars } from "./Chars";

const accents = new Set(["\u0301"]);

export function transformChars(rawChars: RawChars): Chars {
  let chars: Chars = {};
  let entries = Object.entries(rawChars);

  for (let i = entries.length - 1; i >= 0; i--) {
    let [key, value] = entries[i];

    if (key.length === 1)
      chars[key] = {
        ...value,
        character: key,
      };
    else {
      let keys = key.split("");
      let c = keys[0];

      let entry = {
        ...value,
        character: `${accents.has(c) ? "◌" : ""}${c}`,
      };

      for (let k of keys) chars[k] = entry;
    }
  }

  return chars;
}
