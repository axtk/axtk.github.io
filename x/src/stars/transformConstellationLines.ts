import type {Star} from './Star';

function getStarMap(stars: Star[]) {
    let map: Record<string, [number, number]> = {};

    for (let star of stars) {
        let key = star.name?.split(', ').at(-1) || `#${star.id}`;

        map[key] = [star.ra, star.dec];
    }

    return map;
}

export function transformConstellationLines(
    rawConstellationLines: Record<string, string[][]>,
    stars: Star[],
) {
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

    return constellationLines;
}
