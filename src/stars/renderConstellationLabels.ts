import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import type {Context} from './Context';
import type {ConstellationLabel} from './ConstellationLabel';

function getScreenName(item: ConstellationLabel, ctx: Context) {
    if (!item[2])
        return;

    return ctx.constellationNames[item[2]] ?? item[2];
}

export function renderConstellationLabels(ctx: Context) {
    let container = ctx.element.querySelector('g.constellation-labels')!;
    let labels = Array.from(container.querySelectorAll('text'));
    let fragment: DocumentFragment | null = null;

    let item: ConstellationLabel;
    let name: string | undefined;
    let element: SVGTextElement;
    let pos: [number, number, number] | null;
    let k = 0;

    for (let i = 0; i < ctx.constellationLabels.length; i++) {
        item = ctx.constellationLabels[i];
        name = getScreenName(item, ctx);

        if (!item[2] || !name)
            continue;

        pos = getScreenPosition(item[0], item[1], ctx);

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
        element.textContent = name;
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < labels.length; i++)
        labels[i].remove();
}
