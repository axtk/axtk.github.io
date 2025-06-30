import {getScreenPosition} from './getScreenPosition';
import {markerSize} from './const';
import type {RenderOptions} from './RenderOptions';

function updateMarker(position: [number, number], id: string, options: RenderOptions) {
    let marker = options.element.querySelector(`.markers [data-id="${id}"]`)!;

    let d = markerSize[id] ?? markerSize.default;
    let [x, y] = getScreenPosition(position, options);

    marker.setAttribute('data-id', id);
    marker.setAttribute('x', String(x - d/2));
    marker.setAttribute('y', String(y - d/2));
    marker.setAttribute('width', String(d));
    marker.setAttribute('height', String(d));

    return marker;
}

export function renderMarkers(options: RenderOptions) {
    let {tracks: {sun, moon}} = options;

    updateMarker(sun.position, 'sun', options);
    updateMarker(moon.position, 'moon', options);
}
