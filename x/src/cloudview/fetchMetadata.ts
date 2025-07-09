import type {Context} from './Context';
import {ydsdk} from './const';
import {toPath} from './toPath';

export async function fetchMetadata(ctx: Context): Promise<{
    ok: boolean | undefined;
    content: string | null;
}> {
    let {index, url, path} = ctx;

    let indexURL: string | undefined = undefined;
    let indexPath: string | undefined = undefined;

    if (typeof index === 'string') {
        if (index.startsWith('https://')) indexURL = index;
        else indexPath = index;
    }
    else if (index) {
        indexURL = index.url;
        indexPath = index.path;
    }

    if (!indexURL) {
        if (!indexPath)
            indexPath = path ? `${path}.csv` : '_index.csv';

        indexURL = url;
    }

    if (!indexURL)
        return {ok: true, content: null};

    try {
        let {ok, body} = await ydsdk.public.download({
            public_key: indexURL,
            path: toPath(indexPath),
        });

        if (!ok || !body)
            return {ok, content: null};

        let url = `https://night-salad.vercel.app/?u=${encodeURIComponent(body.href)}`;
        let content = await (await fetch(url)).text();

        return {ok: true, content};
    }
    catch {
        return {ok: false, content: null};
    }
}
