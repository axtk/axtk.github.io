import type { Context } from "../Context.ts";
import { split } from "../split.ts";

type IndexEntry = {
  description?: string;
  location?: string;
};

let indexMaps: Record<string, IndexEntry>[] | null = null;

export function getIndexMaps(ctx: Context) {
  if (!indexMaps && ctx.index?.length) {
    indexMaps = ctx.index
      .map(({ content }) => {
        if (!content) return null;

        let lines = content
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s !== "")
          // skip the title line
          .slice(1);

        if (lines.length === 0) return null;

        let map: Record<string, IndexEntry> = {};

        for (let line of lines) {
          let [key, description, location] = split(line);

          if (!key) continue;

          map[key] = {
            description,
            location,
          };
        }

        return map;
      })
      .filter((item) => item !== null);
  }

  return indexMaps;
}
