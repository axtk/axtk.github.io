import type {Context} from '../Context';
import type {ViewItem} from '../ViewItem';

function toMap(s: string) {
    let items = s.split(/\r?\n/)
        .map(s => s.trim())
        .filter(s => s !== '');

    if (items.length === 0)
        return null;

    let map: Record<string, string> = {};

    for (let item of items) {
        let k = item.indexOf(' ');

        if (k === -1)
            continue;

        let key = item.slice(0, k).replace(/[xх]/g, '*');
        let value = item.slice(k).trim();

        if (key && value)
            map[key] = value;
    }

    return map;
}

let indexMap: Record<string, string> | null = null;

export function getDescription({name}: ViewItem, ctx: Context) {
    if (!name || !ctx.indexContent)
        return;

    if (!indexMap)
        indexMap = toMap(ctx.indexContent);

    if (!indexMap)
        return;

    let keyParts = name
        .replace(/(^[^\d]+_|\.\w+$)/g, '')
        .split(/[-_]/)
        .slice(0, 2);

    let key = keyParts.join('_');

    if (indexMap[key])
        return indexMap[key];

    let matchedKey: string | null = null;

    for (let i = keyParts.length; i > 0; i--) {
        key = keyParts.slice(0, i).join('_');

        for (let [k, v] of Object.entries(indexMap)) {
            if (k === key)
                return v;

            let kPrefix = k.endsWith('*') ? k.replace(/\*+$/, '') : k;

            if (key.startsWith(kPrefix) && (
                !matchedKey ||
                matchedKey.length < k.length
            )) {
                matchedKey = k;
            }
        }
    }

    if (!matchedKey)
        return;

    return indexMap[matchedKey];
}
