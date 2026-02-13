import type { Context } from "./Context.ts";

let refs: [number, number, string][] = [
  // [56, 24.3, "Stadt Zürich"],
  [36.5, 15.9, "Basel-Stadt"],
  // [54.7, 73, "Bosco Gurin"],
  [76.2, 32.3, "Eschen, Liechtenstein"],
  // [66.2, 62.1, "Chur, Graubünden"]
];

let refCoords: [number, number][] | null = null;

let qx: number | null = null;
let qy: number | null = null;

export function getCoords(
  { markers }: Pick<Context, "markers">,
  lat: number,
  lon: number,
) {
  if (refCoords === null)
    refCoords = [
      markers.find(({ title }) => title.includes(refs[0][2]))!.position,
      markers.find(({ title }) => title.includes(refs[1][2]))!.position,
    ];

  if (qx === null)
    qx = (refs[1][0] - refs[0][0]) / (refCoords[1][1] - refCoords[0][1]);

  if (qy === null)
    qy = (refs[1][1] - refs[0][1]) / (refCoords[1][0] - refCoords[0][0]);

  let x = refs[0][0] + qx * (lon - refCoords[0][1]);
  let y = refs[0][1] + qy * (lat - refCoords[0][0]);

  return { x, y };
}
