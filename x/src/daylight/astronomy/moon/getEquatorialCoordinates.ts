import { RAD } from "../const";
import { Rx } from "../RotationMatrix";
import { getEclipticalCoordinates } from "./getEclipticalCoordinates";

const eps = 23.43929111 * RAD;

/** RA: phi, Dec: theta */
export function getEquatorialCoordinates(date: Date | number | string) {
  let ecl = getEclipticalCoordinates(date);

  return new Rx(-eps).multiplyByVec(ecl).toPolar();
}
