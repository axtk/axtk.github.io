import type {RenderOptions} from './RenderOptions';

type Dimensions = {
    width: number;
    height: number;
};

let dimensions: Dimensions | null = null;
let cacheKey = '';

export function getDimensions({element}: RenderOptions): Dimensions {
    let currentCacheKey = element.getAttribute('data-size')!;

    if (currentCacheKey === cacheKey && dimensions !== null)
        return dimensions;

    dimensions = {
        width: Number(element.getAttribute('width')!),
        height: Number(element.getAttribute('height')!),
    };

    cacheKey = currentCacheKey;

    return dimensions;
}
