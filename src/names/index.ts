import type {Context} from './Context';
import {fetchData} from './fetchData';
import {renderForm} from './renderForm';
import {renderResult} from './renderResult';

async function init() {
    if (window.history) {
        if (window.location.href.endsWith('?'))
            window.history.pushState(null, '', window.location.pathname);
    }

    let data = await fetchData();

    let ctx: Context = {
        ...data,
        q: new URLSearchParams(window.location.search).get('q')?.trim() ?? '',
    };

    renderForm(ctx);
    renderResult(ctx);
}

init();
