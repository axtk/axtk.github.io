export class ConstellationLabel {
    ra: number;
    dec: number;
    name: string;

    constructor({ra, dec, name}: ConstellationLabel) {
        this.ra = ra;
        this.dec = dec;
        this.name = name;
    }
};
