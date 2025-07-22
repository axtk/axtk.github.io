import type {Context} from './Context';
import {getDimensions} from './getDimensions';
import {hideMenu} from './hideMenu';
import {render} from './render';
import {state} from './state';
import {toBounds} from './toBounds';

const {PI, asin} = Math;

let busy = false;

function move(ctx: Context, dx: number, dy: number) {
    let {tilt} = ctx;
    let {r} = getDimensions(ctx);

    let dPhi = asin(dx/r);
    let dTheta = asin(dy/r);

    let nextPhi = tilt[0] + dPhi;
    let nextTheta = tilt[1] + dTheta;

    tilt[0] = toBounds(nextPhi);

    if (nextTheta >= -PI/2 && nextTheta <= PI/2)
        tilt[1] = nextTheta;

    if (!busy) {
        requestAnimationFrame(() => {
            render(ctx);
            state.write('tilt', tilt);
            busy = false;
        });
        busy = true;
    }
}

function setMouseMoves(ctx: Context) {
    let {element} = ctx;

    let x: number | null = null;
    let y: number | null = null;

    element.addEventListener('mousedown', event => {
        x = event.offsetX;
        y = event.offsetY;
        busy = false;
    });

    element.addEventListener('mouseup', () => {
        x = null;
        y = null;
        busy = false;
    });

    element.addEventListener('mousemove', event => {
        if (x !== null && y !== null) {
            move(ctx, event.offsetX - x, event.offsetY - y);
            x = event.offsetX;
            y = event.offsetY;
        }
    });
}

function setTouches(ctx: Context) {
    let {element} = ctx;

    let x: number | null = null;
    let y: number | null = null;

    element.addEventListener('touchstart', event => {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
        busy = false;
        hideMenu();
    });

    element.addEventListener('touchend', () => {
        x = null;
        y = null;
        busy = false;
    });

    element.addEventListener('touchmove', event => {
        if (x !== null && y !== null) {
            move(ctx, event.changedTouches[0].pageX - x, event.changedTouches[0].pageY - y);
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        }
    });
}

export function initRotation(ctx: Context) {
    setMouseMoves(ctx);
    setTouches(ctx);
}
