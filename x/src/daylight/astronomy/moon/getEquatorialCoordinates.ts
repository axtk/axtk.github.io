import { RAD } from "../const.ts";
import { Rx } from "../RotationMatrix.ts";
import { getEclipticalCoordinates } from "./getEclipticalCoordinates.ts";

const eps = 23.43929111 * RAD;

/** Returns { RA: phi, Dec: theta } */
export function getEquatorialCoordinates(date: Date | number | string) {
  let ecl = getEclipticalCoordinates(date);

  return new Rx(-eps).multiplyByVec(ecl).toPolar();
}
