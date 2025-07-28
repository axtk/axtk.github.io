import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import type {Context} from './Context';
import type {Constellation} from './Constellation';

export function renderConstellationLabels(ctx: Context) {
    let container = ctx.element.querySelector('g.constellation-labels')!;
    let labels = Array.from(container.querySelectorAll('text'));
    let fragment: DocumentFragment | null = null;

    let item: Constellation;
    let element: SVGTextElement;
    let pos: [number, number, number] | null;
    let k = 0;

    for (let i = 0; i < ctx.constellations.length; i++) {
        item = ctx.constellations[i];

        if (!item.name)
            continue;

        pos = getScreenPosition(item.label.ra, item.label.dec, ctx);

        if (pos === null)
            continue;

        element = labels[k++];

        if (!element) {
            if (!fragment)
                fragment = document.createDocumentFragment();

            element = document.createElementNS(ns, 'text');
            fragment.appendChild(element);
        }

        element.setAttribute('x', pos[0].toFixed(3));
        element.setAttribute('y', pos[1].toFixed(3));
        element.textContent = item.name;
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < labels.length; i++)
        labels[i].remove();
}
