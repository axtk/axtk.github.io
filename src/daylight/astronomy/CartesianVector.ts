import {PolarVector} from './PolarVector';

const {PI, sqrt, atan2, sin, cos} = Math;

export class CartesianVector {
    x: number;
    y: number;
    z: number;
    
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toPolar() {
        let {x, y, z} = this;

        let rhoSq = x*x + y*y;
        
        let r = sqrt(rhoSq + z*z);
        let phi = atan2(y, x);
        let theta = atan2(z, sqrt(rhoSq));

        if (phi < 0) phi += 2*PI;

        return new PolarVector(phi, theta, r);
    }
    static fromPolar(vector: PolarVector) {
        let {phi, theta, r} = vector;
        let rho = r*cos(theta);

        return new CartesianVector(
            rho*cos(phi),
            rho*sin(phi),
            r*sin(theta)
        );
    }
}
