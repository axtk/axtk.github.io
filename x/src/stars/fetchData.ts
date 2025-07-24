import {urlMap} from './const';
import {transformStars} from './transformStars';
import {transformConstellationLabels} from './transformConstellationLabels';
import {transformConstellationLines} from './transformConstellationLines';

function fetchText(url: string) {
    return fetch(url).then(res => res.text());
}

function fetchJSON<T>(url: string) {
    return fetch(url).then(res => res.json()) as Promise<T>;
}

export async function fetchData() {
    let [
        rawStars,
        rawConstellationLabels,
        constellationNames,
        rawConstellationLines,
    ] = await Promise.all([
        fetchText(urlMap.stars),
        fetchText(urlMap.constellationLabels),
        fetchJSON(urlMap.constellationNames),
        fetchJSON(urlMap.constellationLines),
    ]) as [
        string,
        string,
        Record<string, string>,
        Record<string, string[][]>,
    ];

    let stars = transformStars(rawStars);
    let constellationLabels = transformConstellationLabels(rawConstellationLabels);
    let constellationLines = transformConstellationLines(rawConstellationLines, stars);

    return {
        stars,
        constellationLabels,
        constellationNames,
        constellationLines,
    };
}
