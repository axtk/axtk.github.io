import {urlMap} from './const';
import {type RawStar, Star} from './Star';
import {type RawConstellationLabel, ConstellationLabel} from './ConstellationLabel';
import {transformConstellationLines} from './transformConstellationLines';

export async function fetchData() {
    let [
        rawStars,
        rawConstellationLabels,
        constellationNames,
        rawConstellationLines,
    ] = await Promise.all([
        urlMap.stars,
        urlMap.constellationLabels,
        urlMap.constellationNames,
        urlMap.constellationLines,
    ].map(url => fetch(url).then(res => res.json()))) as [
        RawStar[],
        RawConstellationLabel[],
        Record<string, string>,
        Record<string, string[][]>,
    ];

    let stars = rawStars.map(data => new Star(data));
    let constellationLabels = rawConstellationLabels.map(data => new ConstellationLabel(data));
    let constellationLines = transformConstellationLines(rawConstellationLines, stars);

    return {
        stars,
        constellationLabels,
        constellationNames,
        constellationLines,
    };
}
