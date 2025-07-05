import type {Context} from './Context';
import {renderForm} from './renderForm';
import {renderResult} from './renderResult';

async function init() {
    let params = new URLSearchParams(window.location.search);

    let ctx: Context = {
        q: params.get('q')?.trim() ?? '',
        eg: [null, '1'].includes(params.get('eg')),
        ge: [null, '1'].includes(params.get('ge')),
        data: {},
    };

    if (window.history) {
        let nextLocation = '';

        if (window.location.href.endsWith('?'))
            nextLocation = window.location.pathname;
        else if (ctx.q && params.get('eg') === '1' && params.get('ge') === '1') {
            params.delete('eg');
            params.delete('ge');

            nextLocation = `?${params.toString()}`;
        }

        if (nextLocation)
            window.history.pushState(null, '', nextLocation);
    }

    renderForm(ctx);
    await renderResult(ctx);
}

init();
