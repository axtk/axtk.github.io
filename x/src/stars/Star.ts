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
    name?: string;

    constructor(data: RawStar) {
        [
            this.ra,
            this.dec,
            this.magnitude,
            this.id,
            this.spectralClass,
            this.name,
        ] = data;
    }
}
