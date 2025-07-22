export type RawConstellationLabel = [
    number, // 0: RA
    number, // 1: Dec
    string, // 2: abbreviated name
];

export class ConstellationLabel {
    ra: number;
    dec: number;
    name: string;

    constructor(data: RawConstellationLabel) {
        [this.ra, this.dec, this.name] = data;
    }
};
