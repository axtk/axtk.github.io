import type { Config } from "glyphmap";
import type { RawChars } from "./Chars";
import { urlMap } from "./const";
import { transformChars } from "./transformChars";

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
