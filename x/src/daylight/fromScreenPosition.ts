import {latThreshold, yOffset} from './const';
import {getDimensions} from './getDimensions';
import type {Context} from './Context';

export function fromScreenPosition(
    [x, y]: [number, number],
    ctx: Context,
) {
    let {width, height} = getDimensions(ctx);

    let az = (ctx.location.lat < latThreshold ? x/width + .5 : x/width)*360;
    let h = (.5 - (y - yOffset)/(height - 2*yOffset))*180;

    while (az < 0)
        az += 360;

    while (az >= 360)
        az -= 360;

    return [az, h];
}
