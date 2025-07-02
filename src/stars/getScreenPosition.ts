import {getDimensions} from './getDimensions';
import type {Context} from './Context';

const {sin, cos} = Math;

export function getScreenPosition(
    alpha: number,
    delta: number,
    ctx: Context,
): [number, number, number] | null {
    let {tilt: [phi, theta]} = ctx;
    let {width: w, height: h, x0, y0, r} = getDimensions(ctx);

    let x1 = r*cos(delta)*cos(alpha);
    let y1 = r*sin(delta);
    let z1 = r*cos(delta)*sin(alpha);

    // Ry(phi)
    let x2 = x1*cos(phi) + z1*sin(phi);
    let y2 = y1;
    let z2 = -x1*sin(phi) + z1*cos(phi);

    // Rx(theta)
    let x = x2;
    let y = y2*cos(theta) - z2*sin(theta);
    let z = y2*sin(theta) + z2*cos(theta);

    if (z < 0 || x < -.75*w || x > 1.75*w || y < -.75*h || y > 1.75*h)
        return null;

    return [x0 + x, y0 - y, z];
}
