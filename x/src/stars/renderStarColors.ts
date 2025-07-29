import type {Context} from './Context';
import {starColors} from './const';

let inited = false;
let starSelector = 'html[data-mode="dark"] #screen .stars circle';

export function renderStarColors(ctx: Context) {
    if (ctx.mode !== 'dark' || inited)
        return;

    let container = ctx.element.parentElement!;
    let defs = container.querySelector('defs');
    let spclDefContent = defs?.querySelector('#spcl')?.outerHTML;

    if (!defs || !spclDefContent)
        return;

    let style = document.createElement('style');
    let regularStyleContent = '';
    let gradientStyleContent = '';
    let defsContent = '';

    gradientStyleContent += `${starSelector}:not([r^="0."]){fill:url(#spcl);}`;

    for (let [key, color] of Object.entries(starColors)) {
        let coloredStarSelector = `${starSelector}[data-spcl^="${key}"]`;

        regularStyleContent += `${coloredStarSelector}[r^="0."]{fill:${color};}`;
        gradientStyleContent += `${coloredStarSelector}:not([r^="0."]){fill:url(#spcl_${key});}`;

        defsContent += `\n${spclDefContent}`
            .replace('id="spcl"', `id="spcl_${key}"`)
            .replaceAll('currentColor', color);
    }

    defs.innerHTML += defsContent;
    style.innerHTML = regularStyleContent;
    style.innerHTML = gradientStyleContent;

    container.prepend(style);
    inited = true;
}
