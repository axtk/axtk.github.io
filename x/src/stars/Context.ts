import type { Constellation } from "./Constellation";
import type { Star } from "./Star";

export type Context = {
  element: SVGElement;
  stars: Star[];
  constellations: Constellation[];
  hintLines: [number, number][][];
  tilt: [number, number];
  mode: "dark" | "light" | "fantasy";
};
