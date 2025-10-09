import { toMJD } from "./toMJD";

const { PI, floor } = Math;

const secs = 86400;
const pi2 = 2 * PI;

/** Greenwich mean sidereal time */
export function toGMST(date: Date | number | string) {
  let MJD = toMJD(date);

  let MJD0 = floor(MJD);
  let UT = secs * (MJD - MJD0);
  let T0 = (MJD0 - 51544.5) / 36525;
  let T = (MJD - 51544.5) / 36525;

  let GMST =
    24110.54841 +
    8640184.812866 * T0 +
    1.0027379093 * UT +
    (0.093104 - 6.2e-6 * T) * T * T;

  return (pi2 / secs) * (GMST % secs);
}
