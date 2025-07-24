import type {Context} from './Context';
import {starColors} from './const';

export function initColors(ctx: Context) {
    let container = ctx.element.parentElement!;
    let defs = container.querySelector('defs');
    let spclDefContent = defs?.querySelector('#spcl')?.outerHTML;

    if (!defs || !spclDefContent)
        return;

    let style = document.createElement('style');
    // let regularStyleContent = '';
    let gradientStyleContent = '';
    let defsContent = '';

    for (let [key, color] of Object.entries(starColors)) {
        let starSelector = `html[data-mode="dark"] #screen .stars circle[data-spcl^="${key}"]`;

        // regularStyleContent += `${starSelector}{fill:${color};}`;
        gradientStyleContent += `${starSelector}{fill:url(#spcl_${key});}`;

        defsContent += `\n${spclDefContent}`
            .replace('id="spcl"', `id="spcl_${key}"`)
            .replaceAll('currentColor', color);
    }

    defs.innerHTML += defsContent;
    // style.innerHTML = `${gradientStyleContent}@media(max-width:600px){${regularStyleContent}}`;
    style.innerHTML = gradientStyleContent;

    container.prepend(style);
}
