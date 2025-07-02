import {ns} from './const';
import {getScreenPosition} from './getScreenPosition';
import type {Context} from './Context';

const {PI} = Math;
const eps = PI/100;

const gridStep = PI/12;
const lineStep = PI/50;

export function renderGrid(ctx: Context) {
    let container = ctx.element.querySelector('g.grid')!;
    let path = container.querySelector('path');

    if (!path) {
        path = document.createElementNS(ns, 'path');
        container.appendChild(path);
    }

    let pos: [number, number, number] | null;
    let d = '';
    let prefix = '';

    for (let theta = -PI/2 + gridStep; theta <= PI/2 - gridStep + eps; theta += gridStep) {
        let di = '';
        let off = false;

        for (let phi = 0; phi <= 2*PI + eps; phi += lineStep) {
            pos = getScreenPosition(phi, theta, ctx);
            prefix = di && !off ? ' L' : 'M';

            if (pos === null) {
                off = true;
                continue;
            }

            if (off)
                off = false;

            di += `${prefix}${pos[0].toFixed(3)},${pos[1].toFixed(3)}`;
        }

        d += `${d ? ' ' : ''}${di}`;
    }

    for (let phi = 0; phi <= 2*PI - gridStep + eps; phi += gridStep) {
        let di = '';
        let off = false;

        for (let theta = -PI/2; theta <= PI/2 + eps; theta += lineStep) {
            pos = getScreenPosition(phi, theta, ctx);
            prefix = di && !off ? ' L' : 'M';

            if (pos === null) {
                off = true;
                continue;
            }

            if (off)
                off = false;

            di += `${prefix}${pos[0].toFixed(3)},${pos[1].toFixed(3)}`;
        }

        d += `${d ? ' ' : ''}${di}`;
    }

    path.setAttribute('d', d);
}
