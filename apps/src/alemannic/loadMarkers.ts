import { dataRoot } from "./dataRoot.ts";
import type { MarkerMetadata } from "./MarkerMetadata.ts";

export async function loadMarkers() {
  let res = await fetch(`${dataRoot}assets/alemannic/samples.json`);

  return ((await res.json()) as { alemannic: MarkerMetadata[] }).alemannic;
}
