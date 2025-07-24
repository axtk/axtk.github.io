import {ns} from './const';
import type {Context} from './Context';

const {floor, random, sin, cos, PI} = Math;

function getRandomColor() {
    return `#${['', '', ''].map(() => floor(50 + 120*random()).toString(16)).join('')}`;
}

let n = 30;
let inited = false;
let starSelector = 'html[data-mode="fantasy"] #screen .stars circle';

export function renderStarPatterns(ctx: Context) {
    if (ctx.mode !== 'fantasy' || inited)
        return;

    let container = ctx.element.parentElement!;
    let defs = container.querySelector('defs');

    if (!defs)
        return;

    let fragment = document.createDocumentFragment();
    let styleContent = '';

    for (let i = 0; i < n; i++) {
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
                    `stroke="${color}" fill="none" ` +
                    `stroke-width="${(.75 + random()).toFixed(3)}" ` +
                    `stroke-opacity="${(.35 + .55*random()).toFixed(3)}"/>`;
            }
        }

        let pattern = document.createElementNS(ns, 'pattern');

        pattern.setAttribute('id', `s_${i}`);
        pattern.setAttribute('viewBox', '0 0 10 10');
        pattern.setAttribute('width', '100%');
        pattern.setAttribute('height', '100%');
        pattern.innerHTML = content;
        fragment.append(pattern);

        styleContent += `${starSelector}:nth-child(${n}n+${i}){fill:url(#s_${i});}`;
    }

    let style = document.createElement('style');
    style.innerHTML = styleContent;

    container.append(style);
    defs.append(fragment);
    inited = true;
}
