import type {YDIn} from 'yd-sdk';
import type {Context} from './Context';
import type {ViewItem} from './ViewItem';
import {ydsdk} from './const';
import {toPath} from './toPath';

const specialFiles = new Set(['_index.csv', '_config.yml']);

export async function fetchItems(ctx: Context): Promise<{
    ok: boolean | undefined;
    items: ViewItem[];
    total?: number;
}> {
    let {
        url,
        path,
        startIndex,
        fileIndex,
        fileName,
        pageSize = 60,
        sort,
        cropPreview,
    } = ctx;

    if (!url)
        return {
            ok: false,
            items: [],
        };

    let params: YDIn.Public.Info = {
        public_key: url,
        sort,
    };

    // ctx.mode = 'standalone';

    if (fileName)
        params.path = toPath(path, fileName);
    else if (fileIndex !== undefined && !isNaN(fileIndex)) {
        params.path = toPath(path);
        params.offset = fileIndex;
        params.limit = 1;
    }
    else {
        params.path = toPath(path);
        params.offset = startIndex;
        params.limit = pageSize + specialFiles.size;
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

    let items: ViewItem[] = rawItems
        .filter(({name}) => !name || !specialFiles.has(name))
        .slice(0, pageSize)
        .map((item, i) => {
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
