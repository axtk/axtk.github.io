import { dataRoot } from "./dataRoot.ts";
import type { RawPlaceMetadata } from "./RawPlaceMetadata.ts";

export async function loadPlaces(): Promise<RawPlaceMetadata[]> {
  let countryCodes = ["ch", "li", "at", "it", "fr", "de"];

  let [ch, li, at, it, fr, de] = await Promise.all(
    countryCodes.map(async (countryCode) => {
      let res = await fetch(
        `${dataRoot}assets/alemannic/places/${countryCode}.json`,
      );

      return res.json() as Promise<RawPlaceMetadata[]>;
    }),
  );

  return [
    ...ch.slice(0, 18),
    ...li.slice(0, 2),
    ...at.slice(0, 12),
    ...it.slice(0, 55),
    ...fr.slice(0, 55),
    ...de.slice(0, 55),
  ];
}
