import {urlMap} from './const';
import type {Context} from './Context';

export async function fetchData(ctx: Context) {
    let [abbrs, ge, eg] = await Promise.all([
        ctx.data.abbrs ? null : urlMap.abbrs,
        ctx.data.ge || !ctx.ge ? null : urlMap.ge,
        ctx.data.eg || !ctx.eg ? null : urlMap.eg,
    ].map(url => url && fetch(url).then(res => res.json()))) as [
        Context['data']['abbrs'],
        Context['data']['ge'],
        Context['data']['eg'],   
    ];

    if (abbrs)
        ctx.data.abbrs = abbrs;
    if (ge)
        ctx.data.ge = ge;
    if (eg)
        ctx.data.eg = eg;
}
