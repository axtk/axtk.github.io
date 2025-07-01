import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import {horizonOffset, ns} from './const';
import type {RenderOptions} from './RenderOptions';

export function renderHorizon(options: RenderOptions) {
    let container = options.element.querySelector('.horizon')!;
    let {width, height} = getDimensions(options);
    let twilights = [
        Array.from(container.querySelectorAll('.under')),
        Array.from(container.querySelectorAll('.above')),
    ];

    for (let k = 0; k < twilights.length; k++) {
        while (twilights[k].length < 3) {
            let horizon = document.createElementNS(ns, 'rect');

            horizon.setAttribute('class', k === 0 ? 'under' : 'above');
            horizon.setAttribute('x', '0');

            container.appendChild(horizon);
            twilights[k].push(horizon);
        }
    }

    for (let i = 0; i < 3; i++) {
        let under = twilights[0][i];
        let above = twilights[1][i];

        let y = getScreenPosition([0, -i*6], options)[1];

        under.setAttribute('y', String(y));
        under.setAttribute('width', String(width));
        under.setAttribute('height', String(height - y - horizonOffset));

        above.setAttribute('y', '0');
        above.setAttribute('width', String(width));
        above.setAttribute('height', String(y));
    }
}
