import { Star } from "./Star";
import { stripQuotes } from "./stripQuotes";

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
