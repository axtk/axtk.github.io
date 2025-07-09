import type {Context} from './Context';
import {fetchText} from './fetchText';

export async function fetchIndex(ctx: Context): Promise<void> {
    let {index, url, path} = ctx;

    if (!index?.length) {
        if (path)
            index = [
                {path: `${path}/_index.csv`},
                {path: `${path}.csv`},
            ];
        else
            index = [{path: '_index.csv'}];
    }

    try {
        let content = await Promise.all(
            index.map(item => fetchText(item.url ?? url, item.path)),
        );

        for (let i = 0; i < index.length; i++)
            index[i].content = content[i];
    }
    catch {}

    ctx.index = index;
}
