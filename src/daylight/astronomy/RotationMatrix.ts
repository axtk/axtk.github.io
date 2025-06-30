import {Matrix} from './Matrix';

const {sin, cos} = Math;

export class Rx extends Matrix {
    constructor(phi: number) {
        super([
            [1,         0,         0],
            [0, +cos(phi), +sin(phi)],
            [0, -sin(phi), +cos(phi)]
        ]);
    }
}

export class Ry extends Matrix {
    constructor(phi: number) {
        super([
            [+cos(phi), 0, -sin(phi)],
            [        0, 1,         0],
            [+sin(phi), 0, +cos(phi)]
        ]);
    }
}

export class Rz extends Matrix {
    constructor(phi: number) {
        super([
            [+cos(phi), +sin(phi), 0],
            [-sin(phi), +cos(phi), 0],
            [0,         0,         1]
        ]);
    }
}
