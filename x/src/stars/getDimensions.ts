import type { Context } from "./Context";

type Dimensions = {
  width: number;
  height: number;
  r: number;
  x0: number;
  y0: number;
};

let dimensions: Dimensions | null = null;
let cacheKey = "";

export function getDimensions({ element }: Context): Dimensions {
  let currentCacheKey = element.getAttribute("data-size")!;

  if (currentCacheKey === cacheKey && dimensions !== null) return dimensions;

  let width = Number(element.getAttribute("width")!);
  let height = Number(element.getAttribute("height")!);

  dimensions = {
    width,
    height,
    r: 0.65 * Math.sqrt(width * width + height * height),
    x0: width / 2,
    y0: height / 2,
  };

  cacheKey = currentCacheKey;

  return dimensions;
}
