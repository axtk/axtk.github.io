import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import type {RenderOptions} from './RenderOptions';

function renderLabel(id: 'sun' | 'moon', options: RenderOptions) {
    let {width} = getDimensions(options);
    let label = document.querySelector<HTMLElement>(`.pos[data-id="${id}"]`)!;
    let {position} = options.tracks[id];

    label.querySelector('.az .value')!.textContent = `${position[0].toFixed(1)}°`;
    label.querySelector('.h .value')!.textContent = `${position[1].toFixed(1)}°`;

    if (id === 'moon') {
        label.querySelector('.ph .value')!.textContent =
            options.tracks.moon.phase.toFixed(2);
    }

    let [x] = getScreenPosition(position, options);
    let {width: labelWidth} = label.querySelector('span')!.getBoundingClientRect();

    label.style.setProperty('--x', `${Math.min(x - 6, width - labelWidth)}px`);
}

export function renderPositionLabels(options: RenderOptions) {
    renderLabel('sun', options);
    renderLabel('moon', options);
}
