import {getHorizontalCoordinates as getSunPosition} from './astronomy/sun/getHorizontalCoordinates';
import {getHorizontalCoordinates as getMoonPosition} from './astronomy/moon/getHorizontalCoordinates';
import {getPhase} from './astronomy/moon/getPhase';
import type {GeoLocation} from './astronomy/GeoLocation';
import type {PolarVector} from './astronomy/PolarVector';
import {DEG} from './astronomy/const';

const pi2 = 2*Math.PI;

const sec = 1000;
const min = 60*sec;
const hr = 60*min;

function getNormalizedPosition({phi, theta}: PolarVector): [number, number] {
    let az = ((phi + Math.PI) % pi2)*DEG;
    let h = theta*DEG;

    return [az, h];
}

function toTimestamp(time: number | string | Date | undefined) {
    if (typeof time === 'number')
        return time;

    if (time === undefined || time === '')
        return Date.now();

    return (time instanceof Date ? time : new Date(time)).getTime();
}

type CrossingResult = {
    time: number | null;
    type: 'rise' | 'set' | null;
    alt: number | null;
    prevAlt: number | null;
    prevTime: number | null;
};

type CrossingIteration = {
    t0: number;
    t: number;
    alt: number;
};

const minVisibleAlt = -.25; // Sun's half angular size below horizon

function updateCrossing(result: CrossingResult, iteration: CrossingIteration) {
    if (
        iteration.t >= iteration.t0 &&
        result.time === null &&
        result.prevAlt !== null &&
        result.prevTime !== null &&
        Math.sign(iteration.alt - minVisibleAlt) !== Math.sign(result.prevAlt - minVisibleAlt)
    ) {
        if (Math.abs(iteration.alt - minVisibleAlt) < Math.abs(result.prevAlt - minVisibleAlt)) {
            result.time = iteration.t;
            result.alt = iteration.alt;
        }
        else {
            result.time = result.prevTime;
            result.alt = result.prevAlt;
        }

        result.type = result.prevAlt < iteration.alt ? 'rise' : 'set';
    }

    result.prevAlt = iteration.alt;
    result.prevTime = iteration.t;
}

const dtMin = -2.5*hr;
const dtMax = 22.5*hr;

const initialCrossingResult: CrossingResult = {
    time: null,
    type: null,
    alt: null,
    prevAlt: null,
    prevTime: null,
};

export function getTracks(
    location: GeoLocation,
    time?: number | string | Date | undefined,
) {
    let t0 = toTimestamp(time);

    // show the past crossing time within 5 min after the crossing
    let crossingRefTime = t0 - 5*min;

    let sunTrack: [number, number][] = [];
    let moonTrack: [number, number][] = [];

    let crossingResult: CrossingResult = {
        ...initialCrossingResult,
    };

    for (let dt = dtMin; dt < dtMax; dt += min) {
        let t = t0 + dt;
        let sunPos = getNormalizedPosition(getSunPosition(t, location));

        // get the approx time of the Sun's crossing the horizon
        updateCrossing(crossingResult, {t0: crossingRefTime, t, alt: sunPos[1]});

        sunTrack.push(sunPos);
        moonTrack.push(
            getNormalizedPosition(getMoonPosition(t, location)),
        );
    }

    let crossingTime = crossingResult.time;

    if (crossingTime !== null) {
        crossingResult = {
            ...initialCrossingResult,
        };

        crossingRefTime -= min;

        // get a more precise time of the Sun's crossing the horizon
        for (let dt = -min; dt < min; dt += sec) {
            let t = crossingTime + dt;
            let sunPos = getNormalizedPosition(getSunPosition(t, location));

            updateCrossing(crossingResult, {t0: crossingRefTime, t, alt: sunPos[1]});
        }
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
            next: {
                alt: crossingResult.alt,
                time: crossingResult.time,
                type: crossingResult.type,
            },
        },
        moon: {
            position: getNormalizedPosition(getMoonPosition(t0, location)),
            track: moonTrack,
            ticks: moonTicks,
            phase: getPhase(t0),
        },
    };
}
