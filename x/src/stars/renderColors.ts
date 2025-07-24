import type {Context} from './Context';
import {starColors} from './const';

let colorsInited = false;

export function renderColors(ctx: Context) {
    if (ctx.mode !== 'dark' || colorsInited)
        return;

    let container = ctx.element.parentElement!;
    let defs = container.querySelector('defs');
    let spclDefContent = defs?.querySelector('#spcl')?.outerHTML;

    if (!defs || !spclDefContent)
        return;

    let style = document.createElement('style');
    let gradientStyleContent = '';
    let defsContent = '';

    for (let [key, color] of Object.entries(starColors)) {
        let starSelector = `html[data-mode="dark"] #screen .stars circle[data-spcl^="${key}"]`;

        gradientStyleContent += `${starSelector}{fill:url(#spcl_${key});}`;

        defsContent += `\n${spclDefContent}`
            .replace('id="spcl"', `id="spcl_${key}"`)
            .replaceAll('currentColor', color);
    }

    defs.innerHTML += defsContent;
    style.innerHTML = gradientStyleContent;

    container.prepend(style);
    colorsInited = true;
}
