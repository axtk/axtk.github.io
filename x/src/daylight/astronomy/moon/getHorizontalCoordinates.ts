import { equ2hor } from "../equ2hor.ts";
import type { GeoLocation } from "../GeoLocation.ts";
import { getEquatorialCoordinates } from "./getEquatorialCoordinates.ts";

export function getHorizontalCoordinates(
  date: Date | number | string,
  location: GeoLocation,
) {
  return equ2hor(getEquatorialCoordinates(date), date, location);
}
