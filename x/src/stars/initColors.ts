import type {Context} from './Context';
import {starColors} from './const';

export function initColors(ctx: Context) {
    let container = ctx.element.parentElement!;
    let defs = container.querySelector('defs');
    let spclDefContent = defs?.querySelector('#spcl')?.outerHTML;

    if (!defs || !spclDefContent)
        return;

    let style = document.createElement('style');
    let styleContent = '';
    let defsContent = '';

    for (let [key, color] of Object.entries(starColors)) {
        styleContent += `html[data-mode="dark"] #screen .stars circle[data-spcl^="${key}"] ` +
            `{ fill: url(#spcl_${key}); }\n`;
        defsContent += `\n${spclDefContent}`
            .replace('id="spcl"', `id="spcl_${key}"`)
            .replaceAll('currentColor', color);
    }

    defs.innerHTML += defsContent;
    style.innerHTML = styleContent;
    container.prepend(style);
}
