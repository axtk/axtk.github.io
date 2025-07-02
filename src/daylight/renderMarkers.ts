import {getScreenPosition} from './getScreenPosition';
import {markerSize} from './const';
import type {Context} from './Context';

function updateMarker(position: [number, number], id: string, ctx: Context) {
    let marker = ctx.element.querySelector(`.markers [data-id="${id}"]`)!;

    let d = markerSize[id] ?? markerSize.default;
    let [x, y] = getScreenPosition(position, ctx);

    marker.setAttribute('data-id', id);
    marker.setAttribute('x', String(x - d/2));
    marker.setAttribute('y', String(y - d/2));
    marker.setAttribute('width', String(d));
    marker.setAttribute('height', String(d));

    return marker;
}

export function renderMarkers(ctx: Context) {
    let {tracks: {sun, moon}} = ctx;

    updateMarker(sun.position, 'sun', ctx);
    updateMarker(moon.position, 'moon', ctx);
}
