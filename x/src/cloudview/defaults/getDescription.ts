import type {Context} from '../Context';
import type {ViewItem} from '../ViewItem';
import {getIndexMaps} from './getIndexMaps';

export function getDescription({name}: ViewItem, ctx: Context): string | undefined {
    if (!name)
        return;

    let indexMaps = getIndexMaps(ctx);

    if (!indexMaps?.length)
        return;

    let keyParts = name
        .replace(/(^[^\d]+_|\.\w+$)/g, '')
        .split(/[-_]/)
        .slice(0, 2);

    let key = keyParts.join('_');
    let matchedMapIndex: number | null = null;
    let matchedKey: string | null = null;

    for (let i = 0; i < indexMaps.length; i++) {
        let map = indexMaps[i];

        if (map[key])
            return map[key].description;

        for (let n = keyParts.length; n > 0; n--) {
            key = keyParts.slice(0, n).join('_');

            for (let k of Object.keys(map)) {
                let kPrefix = k.endsWith('*') ? k.replace(/\*+$/, '') : k;

                if (key.startsWith(kPrefix) && (
                    !matchedKey ||
                    matchedKey.length < k.length
                )) {
                    matchedKey = k;
                    matchedMapIndex = i;
                }
            }
        }
    }

    if (matchedMapIndex !== null && matchedKey !== null)
        return indexMaps[matchedMapIndex]?.[matchedKey]?.description;
}
