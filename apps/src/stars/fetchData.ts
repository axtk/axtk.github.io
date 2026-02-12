import { urlMap } from "./const.ts";
import { transformConstellations } from "./transformConstellations.ts";
import { transformHintLines } from "./transformHintLines.ts";
import { transformStars } from "./transformStars.ts";

async function fetchText(url: string) {
  return fetch(url).then((res) => res.text());
}

export async function fetchData() {
  let [rawStars, rawConstellations, rawHintLines] = await Promise.all(
    [urlMap.stars, urlMap.constellations, urlMap.hintLines].map(fetchText),
  );

  let stars = transformStars(rawStars);
  let constellations = transformConstellations(rawConstellations);
  let hintLines = transformHintLines(rawHintLines, stars);

  return {
    stars,
    constellations,
    hintLines,
  };
}
