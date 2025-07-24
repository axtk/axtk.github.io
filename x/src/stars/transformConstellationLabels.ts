import {ConstellationLabel} from './ConstellationLabel';

export function transformConstellationLabels(data: string) {
    return data.trim().split(/\r?\n/).slice(1).map(line => {
        let [name, ra, dec] = line.split(',');

        return new ConstellationLabel({
            ra: Number(ra),
            dec: Number(dec),
            name,
        });
    });
}
