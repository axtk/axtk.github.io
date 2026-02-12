export function toBounds(
  x: number,
  min = 0,
  max = 2 * Math.PI,
  inclusively?: boolean,
) {
  while (x < min) x += max - min;

  if (inclusively) {
    while (x > max) x -= max - min;
  } else {
    while (x >= max) x -= max - min;
  }

  return x;
}
