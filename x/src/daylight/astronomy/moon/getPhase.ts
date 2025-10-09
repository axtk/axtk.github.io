import { getEclipticalCoordinates as getSunEclipticalCoordinates } from "../sun/getEclipticalCoordinates";
import { getEclipticalCoordinates } from "./getEclipticalCoordinates";

const pi2 = 2 * Math.PI;
const dT = -8.32 / (1440 * 36525);

export function getPhase(date: Date | number | string) {
  let eclLongitudeDiff =
    getEclipticalCoordinates(date).phi -
    getSunEclipticalCoordinates(date, dT).phi;

  return ((eclLongitudeDiff + pi2) % pi2) / pi2;
}
