import {CartesianVector} from './CartesianVector';
import {PolarVector} from './PolarVector';

function getScalarProduct(v1: number[], v2: number[]) {
    let p = 0;
    for (let i = 0, n = Math.min(v1.length, v2.length); i < n; i++)
        p += v1[i]*v2[i];
    return p;
}

export class Matrix {
    value: number[][];
    rows: number[][];
    columns: number[][];

    constructor(value: number[][]) {
        this.value = value;

        let columns: number[][] = [];

        for (let i = 0, n = value.length; i < n; i++) {
            for (let j = 0, m = value[i].length; j < m; j++) {
                if (!columns[j]) columns[j] = new Array(n);
                columns[j][i] = value[i][j];
            }
        }

        this.rows = value;
        this.columns = columns;
    }

    multiplyByVec(v: CartesianVector | PolarVector) {
        return this.multiplyBy(Matrix.fromVector(v)).toCartesianVector();
    }

    multiplyBy(matrix: Matrix) {
        let productValue: number[][] = [];

        for (let i = 0, n = this.rows.length; i < n; i++) {
            for (let j = 0, m = matrix.columns.length; j < m; j++) {
                if (!productValue[i])
                    productValue[i] = new Array(m);

                productValue[i][j] = getScalarProduct(
                    this.rows[i],
                    matrix.columns[j],
                );
            }
        }

        return new Matrix(productValue);
    }

    toCartesianVector() {
        return new CartesianVector(
            this.columns[0][0],
            this.columns[0][1],
            this.columns[0][2]
        );
    }

    static fromVector(v: CartesianVector | PolarVector) {
        if (v instanceof CartesianVector)
            return new Matrix([
                [v.x],
                [v.y],
                [v.z]
            ]);

        if (v instanceof PolarVector)
            return Matrix.fromVector(CartesianVector.fromPolar(v));
    }
}
