import type { FormInput } from "./getFormInput.ts";

export function isValidFormInput({ location, time }: FormInput) {
  if (!location || Number.isNaN(location.lat) || Number.isNaN(location.lon))
    return false;

  if (time === undefined || time === "" || typeof time === "number")
    return true;

  return !Number.isNaN(new Date(time).getTime());
}
