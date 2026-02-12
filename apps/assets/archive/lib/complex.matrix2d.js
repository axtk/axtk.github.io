{

let C = window.complex = window.complex || {};

C.matrix2d = {
    '0': [ [0,0], [0,0], [0,0], [0,0] ],
    '1': [ [1,0], [0,0], [0,0], [1,0] ],
    multiply(m1, m2) {
        let m = [
            C.add(C.multiply(m1[0], m2[0]), C.multiply(m1[1], m2[2])),
            C.add(C.multiply(m1[0], m2[1]), C.multiply(m1[1], m2[3])),
            C.add(C.multiply(m1[2], m2[0]), C.multiply(m1[3], m2[2])),
            C.add(C.multiply(m1[2], m2[1]), C.multiply(m1[3], m2[3]))
        ];
        for (let i = 2; i < arguments.length; i++)
            m = this.multiply(m, arguments[i]);
        return m;
    },
    det(m) {
        return C.subtract(C.multiply(m[0], m[3]), C.multiply(m[1], m[2]));
    },
    valid(m) {
        if (!m) return false;
        for (let i = 0; i < m.length; i++) {
            if (Number.isNaN(C.abs(m[i]))) return false;
        }
        return true;
    }
};

}