import { toDecimal } from "./toDecimal";

const { floor } = Math;

export function toMJD(date: Date | number | string) {
  date = date instanceof Date ? date : new Date(date);

  let Y = date.getUTCFullYear();
  let M = date.getUTCMonth() + 1;
  let D = date.getUTCDate();
  let h = date.getUTCHours();
  let m = date.getUTCMinutes();
  let s = date.getUTCSeconds();

  if (M <= 2) {
    M += 12;
    Y--;
  }

  let b: number;

  if (10000 * Y + 100 * M + D <= 15821004)
    b = -2 + floor((Y + 4716) / 4) - 1179;
  else b = floor(Y / 400) - floor(Y / 100) + floor(Y / 4);

  let mjdMidnight = 365 * Y - 679004 + b + floor(30.6001 * (M + 1)) + D;
  let dayFrac = toDecimal(h, m, s) / 24;

  return mjdMidnight + dayFrac;
}
