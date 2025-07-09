import type {Context} from './Context';
import {fetchText} from './fetchText';
import {parseConfig} from './parseConfig';

export async function fetchMetadata(ctx: Context): Promise<void> {
    let {index, url, path} = ctx;

    try {
        let configContent = await fetchText(url, `${path ?? ''}/_config.yml`);
        let config = parseConfig(configContent);
        let configIndex = config?.index;

        if (configIndex)
            index = (Array.isArray(configIndex) ? configIndex : [configIndex]).map(s => {
                return s.startsWith('https://') ? {url: s} : {path: s};
            });
    }
    catch {}

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
