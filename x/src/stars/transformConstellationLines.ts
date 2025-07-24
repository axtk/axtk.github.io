import type {Star} from './Star';
import {toBayerKey} from './toBayerKey';

function getStarMap(stars: Star[]) {
    let map: Record<string, [number, number]> = {};

    for (let star of stars) {
        let key = star.bayerName || `#${star.id}`;

        map[key] = [star.ra, star.dec];
    }

    return map;
}

export function transformConstellationLines(data: string, stars: Star[]) {
    let starMap = getStarMap(stars);

    return data.trim().split(/\r?\n/).map(line => {
        let t = line.split(',');
        let mappedLine: [number, number][] = [];

        let key = t[0];
        let points = t[1].slice(1, -1).split(' ');

        for (let point of points) {
            let coords: [number, number] | null = null;

            if (point.includes('='))
                coords = starMap[`#${point.split('=').at(-1)}`];

            if (coords) {
                mappedLine.push(coords);
                continue;
            }

            if (point.includes('_')) {
                let k = point.indexOf('_');

                coords = starMap[`${toBayerKey(point.slice(0, k))} ${point.slice(k + 1)}`];
            }
            else coords = starMap[`${toBayerKey(point)} ${key}`];

            if (coords)
                mappedLine.push(coords);
        }

        return mappedLine;
    });
}
