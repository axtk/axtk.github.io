import type { Context } from "./Context.ts";
import { getCoords } from "./getCoords.ts";
import type { PlaceMetadata } from "./PlaceMetadata.ts";
import type { RawPlaceMetadata } from "./RawPlaceMetadata.ts";

const hiddenLocations = ["Uster", "Vernier", "Schaan"];

export function transformPlaces(
  ctx: Pick<Context, "markers">,
  rawPlaces: RawPlaceMetadata[],
): PlaceMetadata[] {
  return rawPlaces
    .map((item) => ({
      ...item,
      ...getCoords(ctx, Number(item.lat), Number(item.lng)),
    }))
    .filter(({ city, x, y }) => {
      let offBounds = x < 0 || x > 100 || y < 0 || y > 100;

      return !offBounds && !hiddenLocations.includes(city);
    });
}
