import type { ConfigContext } from "./Context";
import { split } from "./split";
import { stripQuotes } from "./stripQuotes";

function toCamelCase(s: string) {
  return s.replace(/(\w)_(\w)/g, (_s, a, b) => `${a}${b.toUpperCase()}`);
}

const transform = {
  index: (x: string | string[]) => {
    return (Array.isArray(x) ? x : [x]).map((s) => {
      return s.startsWith("https://") ? { url: s } : { path: s };
    });
  },
  cropPreview: JSON.parse,
  hideDate: JSON.parse,
  aspectRatio: Number,
};

export function parseConfig(s: string | undefined): ConfigContext | undefined {
  if (!s) return;

  let lines = s.split(/\r?\n/).filter((x) => x.trim() !== "");

  let data: Record<string, string | string[] | Record<string, string>> = {};
  let parentKey = "";
  let parentItem: string[] | Record<string, string> | null = null;

  for (let line of lines) {
    let [k, v] = split(line, ":");

    if (parentKey) {
      if (k.startsWith("  ")) {
        k = k.trim();

        if (k.startsWith("-")) {
          k = k.replace(/^-\s*/, "");

          if (!parentItem) parentItem = [];

          (parentItem as string[]).push(k);
        } else {
          if (!parentItem) parentItem = {};

          k = toCamelCase(k);
          v = stripQuotes(v?.trim() ?? "");

          let kx = `${parentKey}.${k}`;

          (parentItem as Record<string, string>)[k] =
            kx in transform ? transform[kx as keyof typeof transform](v) : v;
        }
      } else if (parentItem) {
        data[parentKey] = parentItem;
        parentItem = null;
      } else data[parentKey] = "";
    } else {
      k = toCamelCase(k.replace(/^-\s*/, ""));
      v = v?.trim();

      if (v) {
        v = stripQuotes(v);

        data[k] =
          k in transform ? transform[k as keyof typeof transform](v) : v;
      } else parentKey = k;
    }
  }

  if (parentKey) data[parentKey] = parentItem ?? "";

  return data as ConfigContext;
}
