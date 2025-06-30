import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import {ns} from './const';
import type {RenderOptions} from './RenderOptions';

function getPath(track: [number, number][], id: string, options: RenderOptions) {
    let {width, height} = getDimensions(options);
    let path = document.createElementNS(ns, 'path');
    let d = '';

    let prevX: number | null = null;
    let prevY: number | null = null;

    for (let i = 0; i < track.length; i++) {
        let prefix = d ? ' L' : 'M';
        let [x, y] = getScreenPosition(track[i], options);

        if (
            (prevX !== null && Math.abs(x - prevX) > .95*width) ||
            (prevY !== null && Math.abs(y - prevY) > .95*height)
        )
            prefix = ' M';

        d += `${prefix}${x},${y}`;

        prevX = x;
        prevY = y;
    }

    path.setAttribute('d', d);
    path.setAttribute('class', 'track');
    path.setAttribute('data-id', id);

    return path;
}

function getTicks(ticks: [number, number][], id: string, options: RenderOptions) {
    let fragment = document.createDocumentFragment();

    for (let position of ticks) {
        let tick = document.createElementNS(ns, 'circle');
        let [x, y] = getScreenPosition(position, options);

        tick.setAttribute('cx', String(x));
        tick.setAttribute('cy', String(y));
        tick.setAttribute('r', '1.5');
        tick.setAttribute('class', 'tick');
        tick.setAttribute('data-id', id);

        fragment.appendChild(tick);
    }

    return fragment;
}

export function renderTracks(options: RenderOptions) {
    let {element, tracks: {sun, moon}} = options;
    let container = element.querySelector('g.tracks')!;

    container.innerHTML = '';

    container.appendChild(getPath(sun.track, 'sun', options));
    container.appendChild(getTicks(sun.ticks, 'sun', options));

    container.appendChild(getPath(moon.track, 'moon', options));
    container.appendChild(getTicks(moon.ticks, 'moon', options));
}
