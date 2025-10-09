import { DEG } from "./astronomy/const";
import type { GeoLocation } from "./astronomy/GeoLocation";
import { getHorizontalCoordinates as getMoonPosition } from "./astronomy/moon/getHorizontalCoordinates";
import { getPhase } from "./astronomy/moon/getPhase";
import type { PolarVector } from "./astronomy/PolarVector";
import { getHorizontalCoordinates as getSunPosition } from "./astronomy/sun/getHorizontalCoordinates";

const pi2 = 2 * Math.PI;

const sec = 1000;
const min = 60 * sec;
const hr = 60 * min;

function getNormalizedPosition({ phi, theta }: PolarVector): [number, number] {
  let az = ((phi + Math.PI) % pi2) * DEG;
  let h = theta * DEG;

  return [az, h];
}

function toTimestamp(time: number | string | Date | undefined) {
  if (typeof time === "number") return time;

  if (time === undefined || time === "") return Date.now();

  return (time instanceof Date ? time : new Date(time)).getTime();
}

type CrossingEvent = {
  time: number;
  type: "rise" | "set";
  alt: number;
};

type CrossingResult = {
  refTime: number | null; // t0
  events: CrossingEvent[];
  prevAlt: number | null;
  prevTime: number | null;
};

type CrossingIteration = {
  time: number;
  alt: number;
};

const minVisibleAlt = -0.25; // Sun's half angular size below horizon

function updateCrossing(result: CrossingResult, iteration: CrossingIteration) {
  if (
    (result.refTime === null || iteration.time >= result.refTime) &&
    result.prevAlt !== null &&
    result.prevTime !== null &&
    Math.sign(iteration.alt - minVisibleAlt) !==
      Math.sign(result.prevAlt - minVisibleAlt)
  ) {
    let preferPrev =
      Math.abs(result.prevAlt - minVisibleAlt) <
      Math.abs(iteration.alt - minVisibleAlt);

    let event: CrossingEvent = {
      time: preferPrev ? result.prevTime : iteration.time,
      alt: preferPrev ? result.prevAlt : iteration.alt,
      type: result.prevAlt < iteration.alt ? "rise" : "set",
    };

    result.events.push(event);
    result.refTime = event.time;
  }

  result.prevAlt = iteration.alt;
  result.prevTime = iteration.time;
}

const dtMin = -2.5 * hr;
const dtMax = 22.5 * hr;
const dtMaxExtended = 25 * hr; // to check crossing events

const initialCrossingResult: Omit<CrossingResult, "events"> = {
  refTime: null,
  prevAlt: null,
  prevTime: null,
};

export function getTracks(
  location: GeoLocation,
  time?: number | string | Date | undefined,
) {
  let t0 = toTimestamp(time);

  let sunTrack: [number, number][] = [];
  let moonTrack: [number, number][] = [];

  let crossingResult: CrossingResult = {
    ...initialCrossingResult,
    // show the past crossing time within 5 min after the crossing
    refTime: t0 - 5 * min,
    events: [],
  };

  for (let dt = dtMin; dt < dtMaxExtended; dt += min) {
    let t = t0 + dt;
    let sunPos = getNormalizedPosition(getSunPosition(t, location));

    // get the approx time of the Sun's crossing the horizon
    updateCrossing(crossingResult, { time: t, alt: sunPos[1] });

    if (dt < dtMax) {
      sunTrack.push(sunPos);
      moonTrack.push(getNormalizedPosition(getMoonPosition(t, location)));
    }
  }

  for (let event of crossingResult.events) {
    let preciseCrossingResult: CrossingResult = {
      ...initialCrossingResult,
      events: [],
    };

    // get a more precise time of the Sun's crossing the horizon
    for (let dt = -min; dt < min; dt += sec) {
      let t = event.time + dt;
      let sunPos = getNormalizedPosition(getSunPosition(t, location));

      updateCrossing(preciseCrossingResult, { time: t, alt: sunPos[1] });
    }

    let preciseEvent = preciseCrossingResult.events[0];

    if (preciseEvent) {
      event.time = preciseEvent.time;
      event.alt = preciseEvent.alt;
    }
  }

  let sunTicks: [number, number][] = [];
  let moonTicks: [number, number][] = [];

  for (let dt = 0; dt >= dtMin; dt -= hr) {
    sunTicks.push(getNormalizedPosition(getSunPosition(t0 + dt, location)));
    moonTicks.push(getNormalizedPosition(getMoonPosition(t0 + dt, location)));
  }

  for (let dt = hr; dt < dtMax; dt += hr) {
    sunTicks.push(getNormalizedPosition(getSunPosition(t0 + dt, location)));
    moonTicks.push(getNormalizedPosition(getMoonPosition(t0 + dt, location)));
  }

  return {
    sun: {
      position: getNormalizedPosition(getSunPosition(t0, location)),
      track: sunTrack,
      ticks: sunTicks,
      events: crossingResult.events,
    },
    moon: {
      position: getNormalizedPosition(getMoonPosition(t0, location)),
      track: moonTrack,
      ticks: moonTicks,
      phase: getPhase(t0),
    },
  };
}
