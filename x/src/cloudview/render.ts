import type {Sort} from 'yd-sdk';
import {getDescription} from './defaults/getDescription';
import {getDisplayedDate} from './defaults/getDisplayedDate';
import {renderItems} from './defaults/renderItems';
import {renderNav} from './defaults/renderNav';
import type {Context, InputContext} from './Context';
import {events} from './events';
import {fetchIndex} from './fetchIndex';
import {fetchItems} from './fetchItems';
import {fetchMetadata} from './fetchMetadata';
import {updateURL} from './updateURL';
import {i18n, lang} from './i18n';

export async function render(options: InputContext) {
    updateURL();

    let searchParams = new URLSearchParams(window.location.search);

    let s = searchParams.get('s')?.trim();
    let k = searchParams.get('k')?.trim();
    let n = searchParams.get('n')?.trim();

    let {
        url,
        path,
        index,
        pageSize,
        ...otherOptions
    } = options;

    let ctx: Context = {
        url: searchParams.get('u') || url,
        path: searchParams.get('t') || path,
        index: searchParams.get('i')?.split(',').map(s => {
            return s.startsWith('https://') ? {url: s} : {path: s};
        }) || index,
        sort: '-exif.date_time' as Sort,
        pageSize: pageSize ?? 60,
        startIndex: (s && parseInt(s, 10)) || 0,
        fileIndex: k ? parseInt(k, 10) : undefined,
        fileName: n || undefined,
        mode: document.documentElement.classList.contains('standalone')
            ? 'standalone'
            : 'list',
        getDisplayedDate,
        getDescription,
        renderItems,
        renderNav,
        ...otherOptions,
    };

    document.documentElement.setAttribute('lang', lang());
    document.title = i18n('title');

    if (typeof ctx.fileIndex === 'number' && isNaN(ctx.fileIndex))
        ctx.fileIndex = undefined;

    // some settings (like `cropPreview`) should be fetched
    // before fetching items
    await fetchMetadata(ctx);

    if (ctx.title)
        document.title = ctx.title;

    let [{items, total}] = await Promise.all([
        fetchItems(ctx),
        fetchIndex(ctx),
    ]);

    document.documentElement.classList.remove('loading');

    ctx.items = items;
    ctx.total = total;

    ctx.renderItems?.(ctx);
    ctx.renderNav?.(ctx);

    events.dispatch('render');
}
