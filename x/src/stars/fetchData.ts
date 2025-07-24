import {urlMap} from './const';
import {Star} from './Star';
import {type RawConstellationLabel, ConstellationLabel} from './ConstellationLabel';
import {transformStars} from './transformStars';
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
        fetchJSON(urlMap.constellationLabels),
        fetchJSON(urlMap.constellationNames),
        fetchJSON(urlMap.constellationLines),
    ]) as [
        string,
        RawConstellationLabel[],
        Record<string, string>,
        Record<string, string[][]>,
    ];

    let stars = transformStars(rawStars);
    let constellationLabels = rawConstellationLabels.map(data => new ConstellationLabel(data));
    let constellationLines = transformConstellationLines(rawConstellationLines, stars);

    return {
        stars,
        constellationLabels,
        constellationNames,
        constellationLines,
    };
}
