import {toBayerKey} from './toBayerKey';

export type StarProps = Pick<Star,
    | 'ra'
    | 'dec'
    | 'magnitude'
    | 'id'
    | 'spectralClass'
    | 'properName'
> & {
    bayerName?: string;
};

export class Star {
    /** [0, 2*pi) */
    ra: number;
    /** [-pi/2, pi/2] */
    dec: number;
    magnitude: number;
    id: string;
    spectralClass?: string;
    bayerKey?: string;
    bayerName?: string;
    properName?: string;

    constructor({ra, dec, magnitude, id, spectralClass, bayerName, properName}: StarProps) {
        this.ra = ra;
        this.dec = dec;
        this.magnitude = magnitude;
        this.id = id;
        this.spectralClass = spectralClass;
        this.properName = properName;

        if (bayerName) {
            let [rawBayerKey, ...parts] = bayerName.split(' ');
            let bayerKey = toBayerKey(rawBayerKey);

            this.bayerKey = bayerKey;
            this.bayerName = bayerKey
                ? `${bayerKey}${parts.length === 0 ? '' : ` ${parts.join(' ')}`}`
                : undefined;
        }
    }

    get name() {
        let {bayerName} = this;

        if (bayerName === undefined)
            return;

        return this.properName ? `${this.properName}, ${bayerName}` : bayerName;
    }
}
