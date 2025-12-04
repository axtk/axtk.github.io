import { RAD } from "./astronomy/const.ts";
import type { GeoLocation } from "./astronomy/GeoLocation.ts";

function getLocation(): GeoLocation {
  let input =
    document.querySelector<HTMLInputElement>('form [name="p"]')?.value.trim() ??
    "";

  let s = input.split(/\s*[,;]\s*/);
  let lat = parseFloat(s[0]) * RAD;
  let lon = parseFloat(s[1]) * RAD;

  if (s[0]?.endsWith("S")) lat *= -1;

  if (s[1]?.endsWith("W")) lon *= -1;

  return { lat, lon };
}

function getTime() {
  return document
    .querySelector<HTMLInputElement>('form [name="t"]')
    ?.value.trim();
}

export function getFormInput() {
  return {
    location: getLocation(),
    time: getTime(),
  };
}

export type FormInput = ReturnType<typeof getFormInput>;
