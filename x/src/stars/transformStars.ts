import {Star} from './Star';
import {stripQuotes} from './stripQuotes';

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
