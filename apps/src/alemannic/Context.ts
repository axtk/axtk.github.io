import type { MarkerMetadata } from "./MarkerMetadata.ts";
import type { PlaceMetadata } from "./PlaceMetadata.ts";

export type Context = {
  markers: MarkerMetadata[];
  places: PlaceMetadata[];
};
