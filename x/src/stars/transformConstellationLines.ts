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
            let id: string | undefined = undefined;

            if (point.includes('='))
                id = `#${point.split('=').at(-1)}`;
            else if (point.includes('_')) {
                let k = point.indexOf('_');

                id = `${toBayerKey(point.slice(0, k))} ${point.slice(k + 1)}`;
            }
            else id = `${toBayerKey(point)} ${key}`;

            if (id && starMap[id])
                mappedLine.push(starMap[id]);
        }

        return mappedLine;
    });
}
