{

let regression = window.regression = window.regression || {};

let evaluate = (data, x) => {
    if (x === undefined || x === null || !regression.valid(data))
        return Number.NaN;
    for (let i = 1; i < data.length; i++) {
        if (x >= data[i - 1][0] && x <= data[i][0]) {
            let q = regression.linearize([ data[i - 1], data[i] ]);
            return q.a*x + q.b;
        }
    }
    return Number.NaN;
};

let sort = (data, index) => {
    if (index === undefined || index === null) index = 0;
    if (regression.valid(data) && index >= 0 && index < data[0].length)
        data.sort((p1, p2) => { return p2[index] < p1[index] ? 1 : (p2[index] > p1[index] ? -1 : 0); });
    return data;
};

let scaleToFit = (data1, data2) => {
    let a = 0, b = data1.length - 1;
    let q = 0, k = 0, qi, yi;
    
    while (data1[a][0] < data2[0][0] && ++a < data1.length);
    while (data1[b][0] > data2[data2.length - 1][0] && --b > -1);
    
    for (let i = a; i <= b; i++) {
        yi = evaluate(data2, data1[i][0]);
        if (data1[i][1] !== 0) qi = yi/data1[i][1];
        if (!Number.isNaN(qi)) { q += qi; k++; }
    }

    if (k > 0) q /= k;

    if (q > 1)
        for (let i = 0; i < data1.length; i++) data1[i][1] *= q;
    else if (q > 0 && q < 1)
        for (let i = 0; i < data2.length; i++) data2[i][1] /= q;
};

let cloneDeep = nestedArray => {
    let clonedArray = new Array(nestedArray.length);
    for (let i = 0; i < nestedArray.length; i++)
        clonedArray[i] = nestedArray[i] instanceof Array ? cloneDeep(nestedArray[i]) : nestedArray[i];
    return clonedArray;
};

let merge = (data, scale) => {
    if (!(data instanceof Array))
        return null;
    if (data.length < 2 || !(data[0] instanceof Array))
        return data;
    
    if (data.length !== 2) {
        let z = data[0];
        for (let i = 1; i < data.length; i++)
            z = merge([z, data[i]], scale);
        return z;
    }

    if (!regression.valid(data[0]) || !regression.valid(data[1]))
        return null;
    
    let d = cloneDeep(data);
    
    sort(d[0]);
    sort(d[1]);
    
    if (scale) {
        scaleToFit(d[0], d[1]);
        //scaleToFit(d[1], d[0]);
    }
    
    return sort(d[0].concat(d[1]));
};

regression.merge = merge;

}