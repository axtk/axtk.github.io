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
    constellation?: string;
    properName?: string;

    constructor({ra, dec, magnitude, id, spectralClass, bayerName, properName}: StarProps) {
        this.ra = ra;
        this.dec = dec;
        this.magnitude = magnitude;
        this.id = id;
        this.spectralClass = spectralClass;
        this.properName = properName;

        if (bayerName) {
            [this.bayerKey, this.constellation] = bayerName.split(' ');

            this.bayerKey = toBayerKey(this.bayerKey);
        }
    }

    get bayerName() {
        if (this.bayerKey === undefined)
            return;

        if (this.constellation === undefined)
            return this.bayerKey;

        return `${this.bayerKey} ${this.constellation}`;
    }

    get name() {
        let {bayerName} = this;

        if (bayerName === undefined)
            return;

        return this.properName ? `${this.properName}, ${bayerName}` : bayerName;
    }
}
