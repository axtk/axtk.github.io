import { Constellation } from "./Constellation";
import { stripQuotes } from "./stripQuotes";

export function transformConstellations(data: string) {
  return data
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      let [abbr, ra, dec, name] = line.split(",");

      return new Constellation({
        abbr,
        name: stripQuotes(name)!,
        label: {
          ra: Number(ra),
          dec: Number(dec),
        },
      });
    });
}
