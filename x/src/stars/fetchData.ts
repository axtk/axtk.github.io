import {urlMap} from './const';
import type {Star} from './Star';
import type {ConstellationLabel} from './ConstellationLabel';

function getStarMap(stars: Star[]) {
    let map: Record<string, [number, number]> = {};

    for (let star of stars) {
        let key = star[5]?.split(', ').at(-1) || `#${star[3]}`;

        map[key] = [star[0], star[1]];
    }

    return map;
}

export async function fetchData() {
    let [
        stars,
        constellationLabels,
        constellationNames,
        rawConstellationLines,
    ] = await Promise.all([
        urlMap.stars,
        urlMap.constellationLabels,
        urlMap.constellationNames,
        urlMap.constellationLines,
    ].map(url => fetch(url).then(res => res.json()))) as [
        Star[],
        ConstellationLabel[],
        Record<string, string>,
        Record<string, string[][]>,
    ];

    let starMap = getStarMap(stars);
    let constellationLines: [number, number][][] = [];

    for (let [key, lineSet] of Object.entries(rawConstellationLines)) {
        for (let line of lineSet) {
            let mappedLine: [number, number][] = [];

            for (let item of line) {
                let id: string | undefined = undefined;

                if (item.includes(' #') || item.startsWith('#'))
                    id = item.split(' ').at(-1);
                else if (!item.includes(' ') && key !== '_')
                    id = `${item} ${key}`;
                else id = item;

                if (id && starMap[id])
                    mappedLine.push(starMap[id]);
            }

            if (mappedLine.length !== 0)
                constellationLines.push(mappedLine);
        }
    }

    return {
        stars,
        constellationLabels,
        constellationNames,
        constellationLines,
    };
}
