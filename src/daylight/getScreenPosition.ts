import {latThreshold, yOffset} from './const';
import {getDimensions} from './getDimensions';
import type {RenderOptions} from './RenderOptions';

export function getScreenPosition(
    [az, h]: [number, number],
    options: RenderOptions,
) {
    let {width, height} = getDimensions(options);

    let x = (options.location.lat < latThreshold ? .5 - az/360 : az/360)*width;
    let y = yOffset + (.5 - h/180)*(height - 2*yOffset);

    if (x < 0)
        x += width;

    return [x, y];
}
