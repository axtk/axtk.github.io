{

let math3D = window.math3D = window.math3D || {};

let reducePeriodic = (x, min, max, period) => {
    if (min === undefined) min = 0;
    if (max === undefined) max = 2*Math.PI;
    if (period === undefined) period = max - min;

    while (x >= max) x -= period;
    while (x < min) x += period;
    return x;
};

let multiplyMatrices = function(m1, m2) {
    let m = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++)
                m[3*i + j] += m1[3*i + k]*m2[j + 3*k];
        }
    }
    for (let i = 2; i < arguments.length; i++)
        m = multiplyMatrices(m, arguments[i]);
    return m;
};

math3D.transform = {
    toCartesian(polar) {
        return [
            polar.r*Math.cos(polar.phi)*Math.sin(polar.theta),
            polar.r*Math.sin(polar.phi)*Math.sin(polar.theta),
            polar.r*Math.cos(polar.theta)
        ];
    },
    toPolar(cartesian) {
        let r = Math.sqrt(cartesian[0]*cartesian[0] + cartesian[1]*cartesian[1] + cartesian[2]*cartesian[2]);
        let phi = Math.atan2(cartesian[1], cartesian[0]);
        let theta = r === 0 ? 0 : Math.acos(cartesian[2]/r);
        return this.reduce({ r, phi, theta });
    },
    multiply(object, matrix) {
        // object is a matrix
        if (object.length === 9)
            return multiplyMatrices.apply(null, arguments);

        // object is a Cartesian vector
        let product = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) product[i] += object[j]*matrix[3*i + j];
        }
        for (let i = 2; i < arguments.length; i++)
            product = this.multiply(product, arguments[i]);
        return product;
    },
    rotate(cartesian, axis, angle) {
        return this.multiply(cartesian, this.getRotation(axis, angle));
    },
    add(cartesian1, cartesian2) {
        let sum = [0, 0, 0];
        for (let i = 0; i < 3; i++)
            sum[i] = cartesian1[i] + cartesian2[i];
        for (let i = 2; i < arguments.length; i++)
            sum = this.add(sum, arguments[i]);
        return sum;
    },
    distance(cartesian1, cartesian2) {
        let sqDistance = 0;
        for (let i = 0; i < 3; i++)
            sqDistance += (cartesian2[i] - cartesian1[i])*(cartesian2[i] - cartesian1[i]);
        return Math.sqrt(sqDistance);
    },
    reduce(object) {
        // object is an angle
        if (typeof object === 'number')
            return reducePeriodic(object);

        // object is a polar vector
        object.theta = reducePeriodic(object.theta);
        /*if (object.theta > Math.PI) {
            object.theta = 2*Math.PI - object.theta;
            object.phi += Math.PI;
        }*/
        object.phi = reducePeriodic(object.phi);
        return object;
    },
    getRotation(axis, angle) {
        switch (axis) {
            case 0:
                return [
                    1, 0, 0,
                    0, Math.cos(angle), -Math.sin(angle),
                    0, Math.sin(angle), Math.cos(angle)
                ];
            case 1:
                return [
                    Math.cos(angle), 0, Math.sin(angle),
                    0, 1, 0,
                    -Math.sin(angle), 0, Math.cos(angle)
                ];
            case 2:
                return [
                    Math.cos(angle), -Math.sin(angle), 0,
                    Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 1
                ];
        }
    }
};

}