import {urlMap} from './const';
import {transformStars} from './transformStars';
import {transformConstellations} from './transformConstellations';
import {transformHintLines} from './transformHintLines';

async function fetchText(url: string) {
    return fetch(url).then(res => res.text());
}

export async function fetchData() {
    let [
        rawStars,
        rawConstellations,
        rawHintLines,
    ] = await Promise.all([
        urlMap.stars,
        urlMap.constellations,
        urlMap.hintLines,
    ].map(fetchText));

    let stars = transformStars(rawStars);
    let constellations = transformConstellations(rawConstellations);
    let hintLines = transformHintLines(rawHintLines, stars);

    return {
        stars,
        constellations,
        hintLines,
    };
}
