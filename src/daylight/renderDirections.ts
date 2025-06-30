import {getDimensions} from './getDimensions';
import {fromScreenPosition} from './fromScreenPosition';
import {ns} from './const';
import type {RenderOptions} from './RenderOptions';

const tickLength = 5;
const tickCaptions = ['N', 'E', 'S', 'W'];

export function renderDirections(options: RenderOptions) {
    let container = options.element.querySelector('.directions')!;
    let {width, height} = getDimensions(options);

    let ticks = Array.from(container.querySelectorAll('.tick'));
    let tickLabels = Array.from(container.querySelectorAll('.tick-label'));

    while (ticks.length < 5) {
        let tick = document.createElementNS(ns, 'line');
        tick.setAttribute('class', 'tick');
        container.appendChild(tick);
        ticks.push(tick);
    }

    while (tickLabels.length < 5) {
        let tickLabel = document.createElementNS(ns, 'text');
        container.appendChild(tickLabel);
        tickLabels.push(tickLabel);
    }

    for (let i = 0; i < ticks.length; i++) {
        let tick = ticks[i];
        let x = i/4*width;

        tick.setAttribute('x1', String(x));
        tick.setAttribute('y1', String(height/2 - tickLength));
        tick.setAttribute('x2', String(x));
        tick.setAttribute('y2', String(height/2));
    }

    for (let i = 0; i < tickLabels.length; i++) {
        let tickLabel = tickLabels[i];
        let x = i/4*width;
        let [az] = fromScreenPosition([x, 0], options);

        tickLabel.setAttribute('x', String(x));
        tickLabel.setAttribute('y', String(height/2 + 12));
        tickLabel.textContent = tickCaptions[Math.floor(az/90) % tickCaptions.length];

        if (x < 1)
            tickLabel.setAttribute('class', 'leftmost tick-label');
        else if (x > width - 1)
            tickLabel.setAttribute('class', 'rightmost tick-label');
        else
            tickLabel.setAttribute('class', 'tick-label');
    }
}
