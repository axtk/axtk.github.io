import type { GeoLocation } from "./astronomy/GeoLocation.ts";
import type { getTracks } from "./getTracks.ts";

export type Context = {
  element: SVGElement;
  tracks: ReturnType<typeof getTracks>;
  location: GeoLocation;
  time: number | string | Date | undefined;
};
