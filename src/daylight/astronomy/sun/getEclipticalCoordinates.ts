import {PolarVector} from '../PolarVector';
import {MJD_J2000} from '../const';
import {frac} from '../frac';
import {toMJD} from '../toMJD';

const {sin} = Math;
const pi2 = 2*Math.PI;

export function getEclipticalCoordinates(date: Date | number | string, dT = 0) {
    let T = (toMJD(date) - MJD_J2000)/36525 + dT;

    let M = pi2*frac(.993133 + 99.997361*T);
    let L = pi2*frac(.7859453 + M/pi2 +
        (6893*sin(M) + 72*sin(2*M) + 6191.2*T)/1296e3);

    return new PolarVector(L, 0);
}
