import type {Context} from './Context';
import {ydsdk} from './const';

export async function fetchIndex(ctx: Context): Promise<{
    ok: boolean | undefined;
    content: string | null;
}> {
    let {indexPublicKey} = ctx;

    if (!indexPublicKey)
        return {ok: true, content: null};

    try {
        let {ok, body} = await ydsdk.public.download({
            public_key: indexPublicKey,
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
