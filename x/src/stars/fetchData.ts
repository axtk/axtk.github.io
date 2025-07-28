import {urlMap} from './const';
import {transformStars} from './transformStars';
import {transformConstellations} from './transformConstellations';
import {transformConstellationLines} from './transformConstellationLines';

async function fetchText(url: string) {
    return fetch(url).then(res => res.text());
}

export async function fetchData() {
    let [
        rawStars,
        rawConstellations,
        rawConstellationLines,
    ] = await Promise.all([
        urlMap.stars,
        urlMap.constellations,
        urlMap.hintLines,
    ].map(fetchText));

    let stars = transformStars(rawStars);
    let constellations = transformConstellations(rawConstellations);
    let hintLines = transformConstellationLines(rawConstellationLines, stars);

    return {
        stars,
        constellations,
        hintLines,
    };
}
