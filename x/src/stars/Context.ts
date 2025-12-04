import type { Constellation } from "./Constellation.ts";
import type { Star } from "./Star.ts";

export type Context = {
  element: SVGElement;
  stars: Star[];
  constellations: Constellation[];
  hintLines: [number, number][][];
  tilt: [number, number];
  mode: "dark" | "light" | "fantasy";
  moving?: boolean;
};
