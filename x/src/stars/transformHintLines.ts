import type {Star} from './Star';
import {toBayerKey} from './toBayerKey';

type HintStar = [number, number, number];

function getStarMap(stars: Star[]) {
    let map: Record<string, HintStar> = {};

    for (let star of stars) {
        let key = star.bayerName || `#${star.id}`;

        map[key] = [star.ra, star.dec, star.magnitude];
    }

    return map;
}

function byMagnitude(a: HintStar, b: HintStar) {
    return a[2] - b[2];
}

const numericSuffixes = [1, 2, 3];
const letterSuffixes = ['A', 'B'];

/** If there's no 'alp X', look for 'alp1 X' or 'alp2 X' or 'alp X A' */
function getSimilarlyNamedStar(
    rawBayerKey: string,
    bayerNameTail: string,
    starMap: Record<string, HintStar>,
): HintStar | undefined {
    let stars: HintStar[] = [];

    for (let n of numericSuffixes) {
        let star = starMap[`${toBayerKey(`${rawBayerKey}${n}`)} ${bayerNameTail}`];

        if (star) stars.push(star);
    }

    let bayerKey = toBayerKey(rawBayerKey);

    for (let s of letterSuffixes) {
        let star = starMap[`${bayerKey} ${bayerNameTail} ${s}`];

        if (star) stars.push(star);
    }

    return stars.sort(byMagnitude)[0];
}

export function transformHintLines(data: string, stars: Star[]) {
    let starMap = getStarMap(stars);

    return data.trim().split(/\r?\n/).slice(1).map(line => {
        let t = line.split(',');
        let mappedLine: [number, number][] = [];

        let key = t[0];
        let points = t[1].slice(1, -1).split(' ');

        for (let point of points) {
            let coords: HintStar | null | undefined = null;

            if (point.includes('='))
                coords = starMap[`#${point.split('=').at(-1)}`];

            if (coords) {
                mappedLine.push([coords[0], coords[1]]);
                continue;
            }

            let rawBayerKey = '';
            let bayerNameTail = '';

            if (point.includes('_')) {
                let k = point.indexOf('_');

                rawBayerKey = point.slice(0, k);
                bayerNameTail = point.slice(k + 1).replace(/_/g, ' ');
            }
            else {
                rawBayerKey = point;
                bayerNameTail = key;
            }

            if (rawBayerKey && bayerNameTail) {
                coords = starMap[`${toBayerKey(rawBayerKey)} ${bayerNameTail}`];

                if (!coords)
                    coords = getSimilarlyNamedStar(rawBayerKey, bayerNameTail, starMap);
            }

            if (coords)
                mappedLine.push([coords[0], coords[1]]);
        }

        return mappedLine;
    });
}
