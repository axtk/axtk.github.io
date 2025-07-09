import type {Context} from '../Context';
import {getDefaultQuery} from '../getDefaultQuery';
import {i18n} from '../i18n';

let container: Element | null = null;

function setLink(key: string, href: string | undefined) {
    if (href === undefined || !container)
        return;

    let element = container.querySelector<HTMLLinkElement>(`[data-key="${key}"]`);

    if (element)
        element.href = href;
}

function setParam(key: string, param: string, x: number | undefined) {
    if (x === undefined)
        return;

    let url = x < 1
        ? `?${getDefaultQuery()}`
        : `?${getDefaultQuery('&')}${`${encodeURIComponent(param)}=${encodeURIComponent(x)}`}`;

    setLink(key, url);
}

export function renderNav(ctx: Context) {
    if (!ctx.navContainer)
        return;

    if (!container) {
        container = ctx.navContainer instanceof Element
            ? ctx.navContainer
            : document.querySelector(ctx.navContainer);
    }

    if (!container)
        return;

    if (ctx.mode === 'list') {
        container.innerHTML =
            `<a title="${i18n('list_nav_first_page')}" data-key="start">◀◀</a> ` +
            `<a title="${i18n('list_nav_prev_page')} [←]" data-key="prev">◀</a> ` +
            (ctx.homePage
                ? `<a href="${ctx.homePage}" title="${i18n('list_nav_home')}" data-key="quit">◆</a> `
                : '') +
            `<a title="${i18n('list_nav_next_page')} [→]" data-key="next">▶</a> ` +
            `<a title="${i18n('list_nav_last_page')}" data-key="end">▶▶</a>`;

        let {startIndex, pageSize, total} = ctx;

        if (startIndex !== undefined && pageSize && total !== undefined) {
            let maxStartIndex = (Math.ceil(total/pageSize) - 1)*pageSize;

            setParam('start', 's', startIndex === 0 ? undefined : 0);
            setParam('prev', 's', startIndex === 0 ? undefined : startIndex - pageSize);
            setParam('next', 's', startIndex < maxStartIndex
                ? Math.min(startIndex + pageSize, maxStartIndex)
                : undefined);
            setParam('end', 's', startIndex < maxStartIndex ? maxStartIndex : undefined);
        }
    }

    if (ctx.mode === 'standalone') {
        container.innerHTML =
            `<a title="${i18n('standalone_nav_prev')} [←]" data-key="prev">◀</a> ` +
            `<a title="${i18n('standalone_nav_quit')}" data-key="quit">☰</a> ` +
            `<a title="${i18n('standalone_nav_next')} [→]" data-key="next">▶</a>`;

        let {fileIndex, pageSize} = ctx;

        if (fileIndex !== undefined && pageSize) {
            let s = Math.floor(fileIndex/pageSize)*pageSize;

            setParam('prev', 'k', fileIndex === 0 ? undefined : fileIndex - 1);
            setParam('next', 'k', fileIndex + 1);

            let query = `?${s > 0 ? `${getDefaultQuery('&')}s=${s}` : getDefaultQuery()}`;
            let hash = `#${ctx.items?.[0]?.id ?? ''}`;

            setLink('quit', `${query}${hash}`);
        }
    }
}
