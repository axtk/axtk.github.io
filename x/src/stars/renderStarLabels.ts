import {ns} from './const';
import {getDimensions} from './getDimensions';
import {getScreenPosition} from './getScreenPosition';
import {getStarRadius} from './getStarRadius';
import type {Context} from './Context';
import type {Star} from './Star';

export function renderStarLabels(ctx: Context) {
    let {r} = getDimensions(ctx);
    let maxMagnitude = r < 640 ? 3 : 4;

    let container = ctx.element.querySelector('g.star-labels')!;
    let labels = Array.from(container.querySelectorAll('text'));
    let fragment: DocumentFragment | null = null;

    let star: Star;
    let element: SVGTextElement;
    let pos: [number, number, number] | null;
    let k = 0;

    for (let i = 0; i < ctx.stars.length; i++) {
        star = ctx.stars[i];

        if (!star.bayerKey || star.magnitude > maxMagnitude)
            continue;

        pos = getScreenPosition(star.ra, star.dec, ctx);

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
        element.textContent = star.bayerKey;
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < labels.length; i++)
        labels[i].remove();
}
