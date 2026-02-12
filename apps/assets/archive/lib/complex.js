{

const DEFAULT_PRECISION = Number.EPSILON || Math.pow(2, -52);

let complex = window.complex = {
    'i': [0, 1],
    '0': [0, 0],
    '1': [1, 0],
    abs(z) {
        z = this.toComplex(z);
        return Math.sqrt(z[0]*z[0] + z[1]*z[1]);
    },
    phase(z) {
        z = this.toComplex(z);
        return Math.atan2(z[1], z[0]);
    },
    re(z) {
        return this.toComplex(z)[0];
    },
    im(z) {
        return this.toComplex(z)[1];
    },
    add(z1, z2) {
        z1 = this.toComplex(z1);
        z2 = this.toComplex(z2);
        let z = [ z1[0] + z2[0], z1[1] + z2[1] ];
        for (let i = 2; i < arguments.length; i++)
            z = this.add(z, arguments[i]);
        return z;
    },
    subtract(z1, z2) {
        z1 = this.toComplex(z1);
        z2 = this.toComplex(z2);
        return [ z1[0] - z2[0], z1[1] - z2[1] ];
    },
    multiply(z1, z2) {
        z1 = this.toComplex(z1);
        z2 = this.toComplex(z2);
        let z = [ z1[0]*z2[0] - z1[1]*z2[1], z1[0]*z2[1] + z1[1]*z2[0] ];
        for (let i = 2; i < arguments.length; i++)
            z = this.multiply(z, arguments[i]);
        return z;
    },
    divide(z1, z2) {
        z1 = this.toComplex(z1);
        z2 = this.toComplex(z2);
        let r = this.abs(z2), sqR = r*r;
        return [
            (z1[0]*z2[0] + z1[1]*z2[1])/sqR,
            (-z1[0]*z2[1] + z1[1]*z2[0])/sqR
        ];
    },
    sqrt(z) {
        z = this.toComplex(z);
        let r = Math.sqrt(this.abs(z)), phi = this.phase(z)/2;
        return [ r*Math.cos(phi), r*Math.sin(phi) ];
    },
    exp(z) {
        z = this.toComplex(z);
        let r = Math.exp(z[0]);
        return [ r*Math.cos(z[1]), r*Math.sin(z[1]) ];
    },
    equal(z1, z2, precision) {
        z1 = this.toComplex(z1);
        z2 = this.toComplex(z2);
        if (precision === undefined) precision = DEFAULT_PRECISION;
        return Math.abs(z1[0] - z2[0]) < DEFAULT_PRECISION && Math.abs(z1[1] - z2[1]) < DEFAULT_PRECISION;
    },
    isComplex(x) {
        return x instanceof Array && x.length === 2;
    },
    toComplex(x) {
        if (this.isComplex(x)) return x;
        else if (typeof x === 'number') return [x, 0];
        else if (typeof x === 'string') {
            let c = x.replace(/(^\s*[\[\(\{]|[\]\)\}]\s*$)/g, '').split(/\s*,\s*/);
            if (c && c.length === 2) return [parseFloat(c[0]), parseFloat(c[1])];
        }
        return [Number.NaN, Number.NaN];
    }
};

}