import type {Context} from '../Context';
import {getDefaultQuery} from '../getDefaultQuery';
import {i18n} from '../i18n';

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
            '<picture class="loading"><span>' +
            `<img src="${src}" alt="${item.name ?? ''}" height="300" loading="lazy">` +
            '</span></picture>' +
            '<figcaption><span class="content">' +
            (!ctx.hideDate && displayedDate ? `<span class="date">${displayedDate}</span> ` : '') +
            (description ? `<span class="description">${description}</span> ` : '') +
            '</span><span class="controls">' +
            (ctx.mode === 'list'
                ? `<a href="${fullViewURL}" title="${i18n('list_item_fullscreen')}">⌞⌝</a>`
                : '') +
            '</span></figcaption>';

        container.appendChild(element);

        if (ctx.mode === 'standalone' && description && ctx.items.length === 1) {
            document.title =
                `${description}${!ctx.hideDate && displayedDate ? `, ${displayedDate}` : ''}` +
                ` / ${ctx.title ?? i18n('title')}`;
        }
    }

    for (let image of container.querySelectorAll('img')) {
        if (image.complete) {
            image.closest('picture')?.classList.remove('loading');
            continue;
        }

        image.addEventListener('load', () => {
            image.closest('picture')?.classList.remove('loading');
        });
    }
}
