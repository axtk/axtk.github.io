import type {Star} from './Star';
import {toBayerKey} from './toBayerKey';

function getStarMap(stars: Star[]) {
    let map: Record<string, [number, number, number]> = {};

    for (let star of stars) {
        let key = star.bayerName || `#${star.id}`;

        map[key] = [star.ra, star.dec, star.magnitude];
    }

    return map;
}

function byMagnitude(a: [number, number, number], b: [number, number, number]) {
    return a[2] - b[2];
}

export function transformHintLines(data: string, stars: Star[]) {
    let starMap = getStarMap(stars);

    return data.trim().split(/\r?\n/).slice(1).map(line => {
        let t = line.split(',');
        let mappedLine: [number, number][] = [];

        let key = t[0];
        let points = t[1].slice(1, -1).split(' ');

        for (let point of points) {
            let coords: [number, number, number] | null = null;

            if (point.includes('='))
                coords = starMap[`#${point.split('=').at(-1)}`];

            if (coords) {
                mappedLine.push([coords[0], coords[1]]);
                continue;
            }

            let rawBayerKey = '';
            let constellation = '';

            if (point.includes('_')) {
                let k = point.indexOf('_');

                rawBayerKey = point.slice(0, k);
                constellation = point.slice(k + 1);
            }
            else {
                rawBayerKey = point;
                constellation = key;
            }

            if (rawBayerKey && constellation) {
                coords = starMap[`${toBayerKey(rawBayerKey)} ${constellation}`];

                // if there's no 'alp X', look for 'alp1 X' or 'alp2 X'
                if (!coords) {
                    let coordsSet = [1, 2, 3]
                        .map(n => starMap[`${toBayerKey(`${rawBayerKey}${n}`)} ${constellation}`])
                        .filter(coords => coords !== undefined)
                        .sort(byMagnitude);

                    if (coordsSet.length !== 0)
                        coords = coordsSet[0];
                }
            }

            if (coords)
                mappedLine.push([coords[0], coords[1]]);
        }

        return mappedLine;
    });
}
