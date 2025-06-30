import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import {horizonOffset, ns} from './const';
import type {RenderOptions} from './RenderOptions';

export function renderHorizon(options: RenderOptions) {
    let container = options.element.querySelector('.horizon')!;
    let {width, height} = getDimensions(options);
    let twilights = Array.from(container.querySelectorAll('.twilight'));

    while (twilights.length < 3) {
        let horizon = document.createElementNS(ns, 'rect');

        horizon.setAttribute('class', 'twilight');
        horizon.setAttribute('x', '0');

        container.appendChild(horizon);
        twilights.push(horizon);
    }

    for (let i = 0; i < twilights.length; i++) {
        let twilight = twilights[i];
        let y = getScreenPosition([0, -i*6], options)[1];

        twilight.setAttribute('y', String(y));
        twilight.setAttribute('width', String(width));
        twilight.setAttribute('height', String(height - y - horizonOffset));
    }
}
