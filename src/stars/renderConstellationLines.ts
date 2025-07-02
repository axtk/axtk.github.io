import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import type {Context} from './Context';

export function renderConstellationLines(ctx: Context) {
    let container = ctx.element.querySelector('g.constellation-lines')!;
    let paths = Array.from(container.querySelectorAll('path'));
    let fragment: DocumentFragment | null = null;

    let line: [number, number][];
    let d: string;
    let element: SVGPathElement;
    let pos: [number, number, number] | null;
    let k = 0;

    for (let i = 0; i < ctx.constellationLines.length; i++) {
        line = ctx.constellationLines[i];
        d = '';

        for (let point of line) {
            pos = getScreenPosition(point[0], point[1], ctx);

            if (pos !== null)
                d += `${d ? ' L' : 'M'}${pos[0]},${pos[1]}`;
        }

        if (!d)
            continue;

        element = paths[k++];

        if (!element) {
            if (!fragment)
                fragment = document.createDocumentFragment();

            element = document.createElementNS(ns, 'path');
            fragment.appendChild(element);
        }

        element.setAttribute('d', d);
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < paths.length; i++)
        paths[i].remove();
}
