import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import type {Context} from './Context';
import type {Star} from './Star';

function getStarElement(container: Element, star: Star) {
    let element = container.querySelector(`[data-id="${star[3]}"]`);

    if (!element) {
        element = document.createElementNS(ns, 'circle');
        element.setAttribute('data-id', String(star[3]));
        element.setAttribute('r', String(.5*(7 - star[2])));
        container.appendChild(element);
    }

    return element;
}

export function renderStars(ctx: Context) {
    let container = ctx.element.querySelector('g.stars')!;

    let star: Star;
    let element: Element;
    let pos: [number, number, number] | null;

    for (let i = 0; i < ctx.stars.length; i++) {
        star = ctx.stars[i];
        element = getStarElement(container, star);
        pos = getScreenPosition(star, ctx);

        if (pos === null) {
            element.setAttribute('class', 'hidden');
            continue;
        }

        if (element.hasAttribute('class'))
            element.removeAttribute('class');

        element.setAttribute('cx', String(pos[0].toFixed(3)));
        element.setAttribute('cy', String(pos[1].toFixed(3)));
    }
}
