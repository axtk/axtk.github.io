import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import {getStarRadius} from './getStarRadius';
import type {Context} from './Context';
import type {Star} from './Star';

const {floor, random, sin, cos, PI} = Math;

function getRandomColor() {
    return `#${['', '', ''].map(() => floor(50 + 120*random()).toString(16)).join('')}`;
}

let maxContentSetSize = 30;
let contentSet: string[] = [];

function getStarContent() {
    if (contentSet.length === maxContentSetSize)
        return contentSet[floor(random()*contentSet.length)];

    let content = '';
    let colors = Array.from({length: 2}).map(() => getRandomColor());

    for (let k = 0; k < 2; k++) {
        for (let r = .25*k; r < 5; r++) {
            let phi0 = 2*PI*random();
            let x0 = 5 + r*cos(phi0);
            let y0 = 5 + r*sin(phi0);

            let phi1 = phi0 + PI*(.5 + .5*random());
            let x1 = 5 + r*cos(phi1);
            let y1 = 5 + r*sin(phi1);
            let color = colors[floor(random()*colors.length)];

            content += `<path d="M${x0} ${y0} A ${r} ${r} 0 1 0 ${x1} ${y1}" ` +
                `stroke="${color}" ` +
                `stroke-width="${(.75 + random()).toFixed(3)}" ` +
                `stroke-opacity="${(.35 + .55*random()).toFixed(3)}"/>`;
        }
    }

    contentSet.push(content);

    return content;
}

export function renderCompoundStars(ctx: Context) {
    let container = ctx.element.querySelector('g.stars')!;
    let starElements = Array.from(container.querySelectorAll('svg'));
    let fragment: DocumentFragment | null = null;

    let star: Star;
    let element: SVGElement;
    let pos: [number, number, number] | null;
    let r: number;
    let size: string;
    let k = 0;

    for (let i = 0; i < ctx.stars.length; i++) {
        star = ctx.stars[i];
        pos = getScreenPosition(star[0], star[1], ctx);

        if (pos === null)
            continue;

        element = starElements[k++];

        if (!element) {
            if (!fragment)
                fragment = document.createDocumentFragment();

            element = document.createElementNS(ns, 'svg');
            element.setAttribute('viewBox', '0 0 10 10');
            element.innerHTML = getStarContent();
            fragment.appendChild(element);
        }

        r = getStarRadius(star, ctx);
        size = (2*r).toFixed(3);

        element.setAttribute('x', (pos[0] - r).toFixed(3));
        element.setAttribute('y', (pos[1] - r).toFixed(3));
        element.setAttribute('width', size);
        element.setAttribute('height', size);
        element.setAttribute('data-spcl', star[4]);
    }

    if (fragment)
        container.appendChild(fragment);

    for (let i = k; i < starElements.length; i++)
        starElements[i].remove();
}
