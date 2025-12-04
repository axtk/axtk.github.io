import type { Config } from "glyphmap";
import type { Chars } from "./Chars.ts";

export type Context = {
  q: string;
  config: Config;
  chars: Chars;
};
