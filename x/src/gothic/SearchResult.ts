import type { MatchedItem } from "./MatchedItem.ts";

export type SearchResult = {
  expressions: {
    value: string;
    captureIndex: number;
  }[];
  entries: MatchedItem[];
};
