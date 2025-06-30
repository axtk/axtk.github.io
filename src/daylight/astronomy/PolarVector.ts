export class PolarVector {
    phi: number;
    theta: number;
    r: number;

    constructor(az: number, alt: number, r = 1) {
        this.phi = az;
        this.theta = alt;
        this.r = r;
    }
}
