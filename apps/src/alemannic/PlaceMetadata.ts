import type { RawPlaceMetadata } from "./RawPlaceMetadata.ts";

export type PlaceMetadata = RawPlaceMetadata & {
  x: number;
  y: number;
};
