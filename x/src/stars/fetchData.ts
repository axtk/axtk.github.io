import {urlMap} from './const';
import {transformStars} from './transformStars';
import {transformConstellationLabels} from './transformConstellationLabels';
import {transformConstellationLines} from './transformConstellationLines';
import {transformMap} from './transformMap';

async function fetchText(url: string) {
    return fetch(url).then(res => res.text());
}

export async function fetchData() {
    let [
        rawStars,
        rawConstellationLabels,
        rawConstellationNames,
        rawConstellationLines,
    ] = await Promise.all([
        urlMap.stars,
        urlMap.constellationLabels,
        urlMap.constellationNames,
        urlMap.hintLines,
    ].map(fetchText));

    let stars = transformStars(rawStars);
    let constellationLabels = transformConstellationLabels(rawConstellationLabels);
    let hintLines = transformConstellationLines(rawConstellationLines, stars);
    let constellationNames = transformMap(rawConstellationNames);

    return {
        stars,
        constellationLabels,
        constellationNames,
        hintLines,
    };
}
