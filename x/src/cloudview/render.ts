import type {Sort} from 'yd-sdk';
import {getDescription} from './defaults/getDescription';
import {getDisplayedDate} from './defaults/getDisplayedDate';
import {renderItems} from './defaults/renderItems';
import {renderNav} from './defaults/renderNav';
import type {Context, InputContext} from './Context';
import {fetchIndex} from './fetchIndex';
import {fetchItems} from './fetchItems';

export async function render(options: InputContext) {
    if (window.history) {
        let {href, pathname, search, hash} = window.location;
        let nextLocation = '';

        if (/(\?#?|\??#)$/.test(href))
            nextLocation = pathname;
        else if (/\?#.+$/.test(href))
            nextLocation = pathname + hash;

        if (nextLocation)
            window.history.pushState(null, '', nextLocation);

        if (hash)
            setTimeout(() => {
                window.history.pushState(null, '', pathname + search);
            }, 2000);
    }

    let searchParams = new URLSearchParams(window.location.search);

    let s = searchParams.get('s')?.trim();
    let k = searchParams.get('k')?.trim();
    let n = searchParams.get('n')?.trim();

    let ctx: Context = {
        publicKey: searchParams.get('u') || undefined,
        indexPublicKey: searchParams.get('i') || undefined,
        pageSize: 60,
        sort: '-exif.date_time' as Sort,
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
        ...options,
    };

    if (typeof ctx.fileIndex === 'number' && isNaN(ctx.fileIndex))
        ctx.fileIndex = undefined;

    let [{items, total}, {content: indexContent}] = await Promise.all([
        fetchItems(ctx),
        fetchIndex(ctx),
    ]);

    document.documentElement.classList.remove('loading');

    ctx.items = items;
    ctx.total = total;
    ctx.indexContent = indexContent;

    ctx.renderItems?.(ctx);
    ctx.renderNav?.(ctx);
}
