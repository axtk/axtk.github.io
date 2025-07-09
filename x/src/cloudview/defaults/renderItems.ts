import type {Context} from '../Context';
import {getDefaultQuery} from '../getDefaultQuery';

let container: Element | null = null;

export function renderItems(ctx: Context) {
    if (!ctx.items?.length || !ctx.container)
        return;

    if (!container) {
        container = ctx.container instanceof Element
            ? ctx.container
            : document.querySelector(ctx.container);
    }

    if (!container)
        return;

    if (ctx.mode === 'list' && ctx.aspectRatio !== undefined)
        (container as HTMLElement).style.setProperty('--aspect-ratio', String(ctx.aspectRatio));

    for (let item of ctx.items) {
        let element = document.createElement('figure');
        let src = `https://night-salad.vercel.app/?u=${encodeURIComponent(item.url ?? '')}`;

        let displayedDate = ctx.getDisplayedDate?.(item, ctx);
        let description = ctx.getDescription?.(item, ctx);
        let fullViewURL = `?${getDefaultQuery('&')}k=${encodeURIComponent(item.index ?? '')}` +
            `&n=${encodeURIComponent(item.name ?? '')}`;

        if (item.id)
            element.id = item.id;

        if (item.name)
            element.dataset.name = item.name;

        element.innerHTML =
            '<picture><span>' +
            `<img src="${src}" alt="${item.name ?? ''}" height="300" loading="lazy">` +
            '</span></picture>' +
            '<figcaption><span class="content">' +
            (!ctx.hideDate && displayedDate ? `<span class="date">${displayedDate}</span> ` : '') +
            (description ? `<span class="description">${description}</span> ` : '') +
            '</span><span class="controls">' +
            (ctx.mode === 'list' ? `<a href="${fullViewURL}" title="На весь экран">⌞⌝</a>` : '') +
            '</span></figcaption>';

        container.appendChild(element);
    }

    for (let image of container.querySelectorAll('img')) {
        if (image.complete) {
            image.classList.add('complete');
            continue;
        }

        image.addEventListener('load', () => {
            image.classList.add('complete');
        });
    }
}
