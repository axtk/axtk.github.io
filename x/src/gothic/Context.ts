import type { AbbrEntry } from "./AbbrEntry";
import type { Dictionary } from "./Dictionary";

export type Context = {
  q: string;
  /** English—Gothic */
  eg: boolean;
  /** Gothic—English */
  ge: boolean;
  data: {
    abbrs?: Record<string, AbbrEntry> | null;
    eg?: Dictionary | null;
    ge?: Dictionary | null;
  };
};
