import {bayerDesignationMap, superscriptNumbers} from './const';

export type RawStar = [
    number,  // 0: RA [0, 2*pi)
    number,  // 1: Dec [-pi/2, pi/2]
    number,  // 2: M
    number,  // 3: id
    string,  // 4: spectral class
    string?, // 5: name
];

export class Star {
    /** [0, 2*pi) */
    ra: number;
    /** [-pi/2, pi/2] */
    dec: number;
    magnitude: number;
    id: number;
    spectralClass: string;
    originalName?: string;

    _name?: string | null;
    _bayerKey?: string | null;

    constructor(data: RawStar) {
        [
            this.ra,
            this.dec,
            this.magnitude,
            this.id,
            this.spectralClass,
            this.originalName,
        ] = data;
    }

    get name() {
        this._updateNames();

        return this._name ?? undefined;
    }

    get bayerKey() {
        this._updateNames();

        return this._bayerKey ?? undefined;
    }

    _updateNames(): void {
        if (this._name !== undefined)
            return;

        if (!this.originalName) {
            this._name = null;
            this._bayerKey = null;

            return;
        }

        let sepIndex = this.originalName.indexOf(',');

        let properName = sepIndex === -1
            ? null
            : this.originalName.slice(0, sepIndex).trim();

        let bayerName = sepIndex === -1
            ? this.originalName
            : this.originalName.slice(sepIndex + 1).trim();

        let matches = bayerName.match(/^(\S+)\s+(.*)$/);

        if (!matches || matches.length < 2) {
            this._name = this.originalName;
            this._bayerKey = null;

            return;
        }

        let [, bayerKey, constellation] = matches;

        matches = bayerKey.match(/^([^\d]+)(\d+)?$/);

        if (!matches || matches.length < 2) {
            this._name = this.originalName;
            this._bayerKey = bayerKey;

            return;
        }

        let [, charKey, numKey] = matches;

        this._bayerKey = bayerDesignationMap[charKey] ?? charKey;

        if (numKey)
            this._bayerKey += superscriptNumbers[Number(numKey)] ?? numKey;

        this._name = `${properName ? `${properName}, ` : ''}${this._bayerKey} ${constellation}`;
    }
}
