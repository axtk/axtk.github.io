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
            `${Math.round(options.tracks.moon.phase*100)}%`;
    }
    else if (id === 'sun') {
        let {next} = options.tracks.sun;

        if (next.time !== null && next.type !== null) {
            let d = new Date(next.time);

            label.querySelector('.next .value')!.textContent =
                `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            label.querySelector('.next .type')!.textContent =
                next.type === 'rise' ? 'Rise' : 'Set';
        }
    }

    let [x] = getScreenPosition(position, options);
    let {width: labelWidth} = label.querySelector('span')!.getBoundingClientRect();

    label.style.setProperty('--x', `${Math.min(x - 6, width - labelWidth)}px`);
}

export function renderPositionLabels(options: RenderOptions) {
    renderLabel('sun', options);
    renderLabel('moon', options);
}
