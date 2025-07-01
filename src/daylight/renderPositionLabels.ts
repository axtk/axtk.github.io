import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import type {RenderOptions} from './RenderOptions';

function renderLabel(id: 'sun' | 'moon', options: RenderOptions) {
    let {width} = getDimensions(options);
    let label = document.querySelector<HTMLElement>(`.pos[data-id="${id}"]`)!;
    let {position} = options.tracks[id];

    label.querySelector('.az .value')!.textContent = `${position[0].toFixed(1)}°`;
    label.querySelector('.alt .value')!.textContent = `${position[1].toFixed(1)}°`;

    if (id === 'moon') {
        label.querySelector('.ph .value')!.textContent =
            `${Math.round(options.tracks.moon.phase*100)}%`;
    }
    else if (id === 'sun') {
        let events = options.tracks.sun.events.slice(0, 2);
        let content = '';

        for (let {time, type} of events) {
            let d = new Date(time);
            let t = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

            content += `${content ? ' ' : ''}<span class="event">` +
                `<span class="type">${type === 'rise' ? 'Rise' : 'Set'}</span> ` +
                `<span class="value">${t}</span></span>`;
        }

        label.querySelector('.events')!.innerHTML = content;
    }

    let [x] = getScreenPosition(position, options);
    let {width: labelWidth} = label.querySelector('span')!.getBoundingClientRect();

    label.style.setProperty('--x', `${Math.min(x - 6, width - labelWidth)}px`);
}

export function renderPositionLabels(options: RenderOptions) {
    renderLabel('sun', options);
    renderLabel('moon', options);
}
