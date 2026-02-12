{

let regression = window.regression = {

    toFineMesh(data, options) {
        if (!this.valid(data)) return data;
        if (!options) options = {};
    
        let n = options.n || 100, u = [];
        if (data.length > n) return data;
        
        let x = [ data[0][0], data[data.length - 1][0] ];
        let dx = (x[1] - x[0])/n, q;
        
        for (let k = 0; k < data.length - 1; k++) {
            u.push(data[k]);
            if (data[k] && data[k + 1] && data[k].length > 1 && data[k + 1].length > 1) {
                m = (data[k + 1][0] - data[k][0])/dx;
                for (let i = 1; i < m; i++) {
                    p = new Array(data[k].length);
                    p[0] = data[k][0] + i*dx;
                    for (let j = 1; j < p.length; j++)
                        p[j] = data[k][j] + (data[k + 1][j] - data[k][j])*i/m;
                    u.push(p);
                }
            }
        }
        if (u.length && u[u.length - 1][0] < x[1])
            u.push(data[data.length - 1]);

        return u;
    },
    
    // least squares
    linearize(data) {
        if (!this.valid(data)) return {};
    
        let sq = { x: 0, y: 0 }, mean = { x: 0, y: 0, xy: 0 };
        let a, b;
        
        for (let i = 0; i < data.length; i++) {
            sq.x += data[i][0]*data[i][0]; mean.x += data[i][0];
            sq.y += data[i][1]*data[i][1]; mean.y += data[i][1];
            mean.xy += data[i][0]*data[i][1];
        }
        
        for (let i = 0; i < sq.length; i++)
            sq[i] /= data.length;
        
        for (let i = 0; i < mean.length; i++)
            mean[i] /= data.length;
        
        a = (mean.xy - mean.x*mean.y)/(sq.x - mean.x*mean.x);
        b = (sq.x*mean.y - mean.x*mean.xy)/(sq.x - mean.x*mean.x);
        
        return { a: a, b: b }; // y = ax + b
    },

    getLinearSpline(data, options) {
        if (!this.valid(data) || options.knots === null || options.knots <= 0)
            return null;

        if (!options) options = {};

        let spline;
        
        if (data.length > 2*options.knots) {
            let n = Math.floor(data.length/options.knots), q, x;
            spline = new Array(options.knots);
            for (let i = 0; i < options.knots; i++) {
                q = this.linearize(data.slice(i*n, (i + 1)*n));
                x = (data[i*n][0] + data[(i + 1)*n - 1][0])/2;
                spline[i] = [ x, q.a*x + q.b ];
            }
        }
        
        return spline || data;
    },

    valid(data) {
        return data && data.length && data[0].length > 1;
    },
    
    getExtremalValues(data) {
        if (!this.valid(data)) return null;
        let extrema = [], y = [0, 0], yi;
        
        for (let i = 1; i < data.length - 1; i++) {
            yi = data[i][1];
            y[0] = data[i - 1][1];
            y[1] = data[i + 1][1];

            if ((y[0] < yi && y[1] < yi) || (y[0] > yi && y[1] > yi))
                extrema.push(data[i]);
        }
        
        return extrema;
    },
    
    min(data, index) {
        if (index === undefined) index = 0;
        let z = Number.NaN;
        if (this.valid(data) && index >= 0 && index < data[0].length) {
            z = data[0][index];
            for (let i = 0; i < data.length; i++) {
                if (z > data[i][index]) z = data[i][index];
            }
        }
        return z;
    },
    
    max(data, index) {
        if (index === undefined) index = 0;
        let z = Number.NaN;
        if (this.valid(data) && index >= 0 && index < data[0].length) {
            z = data[0][index];
            for (let i = 0; i < data.length; i++) {
                if (z < data[i][index]) z = data[i][index];
            }
        }
        return z;
    }

};

}