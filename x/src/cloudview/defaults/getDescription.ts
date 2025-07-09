import type {Context} from '../Context';
import type {ViewItem} from '../ViewItem';
import {getIndexMap} from './getIndexMap';

export function getDescription({name}: ViewItem, ctx: Context) {
    if (!name || !ctx.indexContent)
        return;

    let indexMap = getIndexMap(ctx.indexContent);

    if (!indexMap)
        return;

    let keyParts = name
        .replace(/(^[^\d]+_|\.\w+$)/g, '')
        .split(/[-_]/)
        .slice(0, 2);

    let key = keyParts.join('_');

    if (indexMap[key])
        return indexMap[key].description;

    let matchedKey: string | null = null;

    for (let i = keyParts.length; i > 0; i--) {
        key = keyParts.slice(0, i).join('_');

        for (let k of Object.keys(indexMap)) {
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

    return indexMap[matchedKey].description;
}
