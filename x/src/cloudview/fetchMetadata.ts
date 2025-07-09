import type {Context, ConfigContext} from './Context';
import {fetchText} from './fetchText';
import {parseConfig} from './parseConfig';

const configProps: (keyof ConfigContext)[] = [
    'index',
    'title',
    'aspectRatio',
    'cropPreview',
    'hideDate',
    'sort',
];

export async function fetchMetadata(ctx: Context): Promise<void> {
    let {url, path} = ctx;

    try {
        let configContent = await fetchText(url, `${path ?? ''}/_config.yml`);
        let config = parseConfig(configContent);

        if (config) {
            for (let k of configProps) {
                // @ts-ignore
                if (config[k] !== undefined) ctx[k] = config[k];
            }
        }
    }
    catch {}

    let {index} = ctx;

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
