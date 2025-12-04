import { Star } from "./Star.ts";
import { stripQuotes } from "./stripQuotes.ts";

function byMagnitude(s1: Star, s2: Star) {
  return s1.magnitude - s2.magnitude;
}

export function transformStars(data: string) {
  return data
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      let [ra, dec, magnitude, spectralClass, id, bayerName, properName] =
        line.split(",");

      return new Star({
        ra: Number(ra),
        dec: Number(dec),
        magnitude: Number(magnitude),
        id,
        spectralClass,
        bayerName: stripQuotes(bayerName),
        properName: stripQuotes(properName),
      });
    })
    .sort(byMagnitude);
}
