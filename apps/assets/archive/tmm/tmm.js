{

let C = window.complex, M = C.matrix2d;

// CGS
const Const = {
    hbar: 6.586e-16,
    me: {
        g: 9.109e-28,
        eV: 0.511e6
    },
    c: 3.0e10,
    unit: {
        nm: 1.0e-7,
        meV: 1.0e-3
    }
};

const PRECISION = Number.EPSILON || Math.pow(2, -52);

let tmm = window.tmm = {

    // data: [[x, U, m]]
    run(data, options) {
        if (!options) options = {};
    
        let n = options.n || 100, q = options.q || 1.6;
        let u = [null, null], t = [], ek, tk;
        
        data = regression.toFineMesh(data, { n: n });
        
        for (let i = 0; i < data.length; i++) {
            if (u[0] === null || u[0] > data[i][1]) u[0] = data[i][1];
            if (u[1] === null || u[1] < data[i][1]) u[1] = data[i][1];
        }
        
        for (let k = 0; k < n; k++) {
            ek = u[0] + q*(u[1] - u[0])*k/n;
            tk = this.getTransmittance(ek, data);
            if (!Number.isNaN(tk)) t.push([ ek, tk ]);
        }
        
        return t;
    },

    getTransmittance(e, data) {
        let u = [null, null], m = [null, null], k = [null, null];
        let t = M['1'], d10, p1;
        let hc = Const.hbar*Const.c;
        
        e *= Const.unit.meV;
    
        for (let i = 1; i < data.length; i++) {
            u[0] = data[i - 1][1]*Const.unit.meV;
            u[1] = data[i][1]*Const.unit.meV;
            
            m[0] = data[i - 1][2]*Const.me.eV;
            m[1] = data[i][2]*Const.me.eV;
            
            k[0] = C.divide(C.sqrt(2*m[0]*(e - u[0])), hc);
            k[1] = C.divide(C.sqrt(2*m[1]*(e - u[1])), hc);
            
            d10 = this.getTransferMatrix(k, m);
            p1 = this.getPropagationMatrix(k[1], Math.abs(data[i][0] - data[i - 1][0])*Const.unit.nm);
            
            if (M.valid(d10) && M.valid(p1)) {
                t = M.multiply(d10, t);
                if (i < data.length - 1) t = M.multiply(p1, t);
            }
        }
        
        let transmittance = C.divide(M.det(t), t[3]);
        return C.abs(transmittance);
    },

    getTransferMatrix(k, m) {
        if (C.abs(k[1]) < PRECISION) return M['0'];
        
        let qk = C.divide(k[0], k[1]);
        let qm = .5*m[1]/m[0];
        
        let z = [
            C.add(C.multiply(qk, qm), .5),
            C.add(C.multiply(qk, -qm), .5)
        ];

        return [ z[0], z[1], z[1], z[0] ];
        
    },
    
    getPropagationMatrix(k, dx) {
        return [
            C.exp(C.multiply(C.i, k, dx)),
            C['0'], C['0'],
            C.exp(C.multiply(C.i, k, -dx))
        ];
    }

};

}