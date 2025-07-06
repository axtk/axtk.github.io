import {bayerDesignationMap, superscriptNumbers, ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import {getStarRadius} from './getStarRadius';
import type {Context} from './Context';
import type {Star} from './Star';

function getScreenName(star: Star) {
    if (!star[5])
        return;

    // 'Albireo, bet1 Cyg' -> 'bet1'
    let fullKey = star[5].split(', ').at(-1)?.split(' ')?.[0];
    let matches = fullKey?.match(/^([^\d]+)(\d+)?$/);

    if (!matches || matches.length < 2)
        return;

    let key = bayerDesignationMap[matches[1]] ?? matches[1] ?? '';

    if (!key)
        return;

    let n = matches[2] ? superscriptNumbers[Number(matches[2])] ?? '' : '';

    return `${key}${n}`;
}

export function renderStarLabels(ctx: Context) {
    let container = ctx.element.querySelector('g.star-labels')!;
    let labels = Array.from(container.querySelectorAll('text'));
    let fragment: DocumentFragment | null = null;

    let star: Star;
    let name: string | undefined;
    let element: SVGTextElement;
    let pos: [number, number, number] | null;
    let k = 0;

    for (let i = 0; i < ctx.stars.length; i++) {
        star = ctx.stars[i];
        name = getScreenName(star);

        if (!name)
            continue;

        pos = getScreenPosition(star[0], star[1], ctx);

        if (pos === null)
            continue;

        element = labels[k++];

        if (!element) {
            if (!fragment)
                fragment = document.createDocumentFragment();

            element = document.createElementNS(ns, 'text');
            fragment.appendChild(element);
        }

        let r = getStarRadius(star, ctx);

        element.setAttribute('x', (pos[0] + r + 2).toFixed(3));
        element.setAttribute('y', (pos[1] + 2).toFixed(3));
        // to show fewer labels on smaller screens
        element.setAttribute('data-x', star[2] < 3 ? '1' : '0');
        element.textContent = name;
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < labels.length; i++)
        labels[i].remove();
}
