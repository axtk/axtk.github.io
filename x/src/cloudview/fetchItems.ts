import type {YDIn} from 'yd-sdk';
import type {Context} from './Context';
import type {ViewItem} from './ViewItem';
import {ydsdk} from './const';

export async function fetchItems(ctx: Context): Promise<{
    ok: boolean | undefined;
    items: ViewItem[];
    total?: number;
}> {
    let {
        path,
        startIndex,
        fileIndex,
        fileName,
        publicKey,
        pageSize,
        sort,
        cropPreview,
    } = ctx;

    if (!publicKey)
        return {
            ok: false,
            items: [],
        };

    let params: YDIn.Public.Info = {
        public_key: publicKey,
        sort,
    };

    // ctx.mode = 'standalone';

    if (fileName) {
        params.path = path
            ? `/${[...path.split('/'), fileName].filter(Boolean).join('/')}`
            : `/${fileName}`;
    }
    else if (fileIndex !== undefined && !isNaN(fileIndex)) {
        params.path = path;
        params.offset = fileIndex;
        params.limit = 1;
    }
    else {
        params.path = path;
        params.offset = startIndex;
        params.limit = pageSize;
        params.preview_size = '1024x';
        params.preview_crop = Boolean(cropPreview);

        // ctx.mode = 'list';
    }

    let {ok, body} = await ydsdk.public.info(params);

    if (!ok || !body)
        return {
            ok,
            items: [],
        };

    let rawItems = params.offset === undefined
        ? [body]
        : body._embedded?.items ?? [];

    let items: ViewItem[] = rawItems.map((item, i) => {
        return {
            id: item.resource_id && `x${item.resource_id.slice(-10)}`,
            name: item.name,
            index: params.offset === undefined ? undefined : params.offset + i,
            url: ctx.mode === 'list' ? item.preview : item.file,
            date: item.created,
            exifDate: item.exif?.date_time,
        };
    });

    return {
        ok,
        items,
        total: body._embedded?.total,
    };
}
