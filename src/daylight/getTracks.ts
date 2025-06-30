import {getHorizontalCoordinates as getSunPosition} from './astronomy/sun/getHorizontalCoordinates';
import {getHorizontalCoordinates as getMoonPosition} from './astronomy/moon/getHorizontalCoordinates';
import {getPhase} from './astronomy/moon/getPhase';
import type {GeoLocation} from './astronomy/GeoLocation';
import type {PolarVector} from './astronomy/PolarVector';
import {DEG} from './astronomy/const';

const pi2 = 2*Math.PI;
const min = 6e4;
const hr = 60*min;

function getNormalizedPosition({phi, theta}: PolarVector): [number, number] {
    let az = ((phi + Math.PI) % pi2)*DEG;
    let h = theta*DEG;

    return [az, h];
}

function toTimestamp(time: number | string | Date | undefined) {
    if (typeof time === 'number')
        return time;

    if (time === undefined)
        return Date.now();

    return (time instanceof Date ? time : new Date(time)).getTime();
}

const dtMin = -2.5*hr;
const dtMax = 22.5*hr;

export function getTracks(location: GeoLocation, time?: number | string | Date) {
    let t0 = toTimestamp(time);

    let sunTrack: [number, number][] = [];
    let moonTrack: [number, number][] = [];

    for (let dt = dtMin; dt < dtMax; dt += min) {
        sunTrack.push(
            getNormalizedPosition(getSunPosition(t0 + dt, location)),
        );
        moonTrack.push(
            getNormalizedPosition(getMoonPosition(t0 + dt, location)),
        );
    }

    let sunTicks: [number, number][] = [];
    let moonTicks: [number, number][] = [];

    for (let dt = 0; dt >= dtMin; dt -= hr) {
        sunTicks.push(
            getNormalizedPosition(getSunPosition(t0 + dt, location)),
        );
        moonTicks.push(
            getNormalizedPosition(getMoonPosition(t0 + dt, location)),
        );
    }

    for (let dt = hr; dt < dtMax; dt += hr) {
        sunTicks.push(
            getNormalizedPosition(getSunPosition(t0 + dt, location)),
        );
        moonTicks.push(
            getNormalizedPosition(getMoonPosition(t0 + dt, location)),
        );
    }

    return {
        sun: {
            position: getNormalizedPosition(getSunPosition(t0, location)),
            track: sunTrack,
            ticks: sunTicks,
        },
        moon: {
            position: getNormalizedPosition(getMoonPosition(t0, location)),
            track: moonTrack,
            ticks: moonTicks,
            phase: getPhase(t0),
        },
    };
}
