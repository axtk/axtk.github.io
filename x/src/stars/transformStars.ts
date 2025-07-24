import {Star} from './Star';

function stripQuotes(s: string | undefined) {
    if (!s || !s.startsWith('"') || !s.endsWith('"'))
        return s;

    return s.slice(1, -1);
}

export function transformStars(data: string) {
    return data.trim().split(/\r?\n/).slice(1).map(line => {
        let [ra, dec, magnitude, id, spectralClass, bayerName, properName] = line.split(',');

        return new Star({
            ra: Number(ra),
            dec: Number(dec),
            magnitude: Number(magnitude),
            id,
            spectralClass,
            bayerName: stripQuotes(bayerName),
            properName: stripQuotes(properName),
        });
    });
}
