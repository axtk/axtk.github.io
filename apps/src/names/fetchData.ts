import type { Config } from "glyphmap";
import type { RawChars } from "./Chars.ts";
import { urlMap } from "./const.ts";
import { transformChars } from "./transformChars.ts";

export async function fetchData() {
  let [config, rawChars] = (await Promise.all(
    [urlMap.config, urlMap.chars].map((url) =>
      fetch(url).then((res) => res.json()),
    ),
  )) as [Config, RawChars];

  return {
    config,
    chars: transformChars(rawChars),
  };
}
