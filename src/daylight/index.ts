import {RAD} from './astronomy/const';
import type {GeoLocation} from './astronomy/GeoLocation';
import {getTracks} from './getTracks';
import {setDimensions} from './setDimensions';
import {renderDirections} from './renderDirections';
import {renderForm} from './renderForm';
import {renderHorizon} from './renderHorizon';
import {renderMarkers} from './renderMarkers';
import {renderMarkerLines} from './renderMarkerLines';
import {renderMoonPhase} from './renderMoonPhase';
import {renderPositionLabels} from './renderPositionLabels';
import {renderTracks} from './renderTracks';
import type {RenderOptions} from './RenderOptions';

function getLocation(): GeoLocation {
    let input = document.querySelector<HTMLInputElement>('form [name="p"]')?.value.trim() ?? '';

    let s = input.split(/\s*[,;]\s*/);
    let lat = parseFloat(s[0])*RAD;
    let lon = parseFloat(s[1])*RAD;

    if (s[0]?.endsWith('S'))
        lat *= -1;

    if (s[1]?.endsWith('W'))
        lon *= -1;

    return {lat, lon};
}

function getTime() {
    let input = document.querySelector<HTMLInputElement>('form [name="t"]')?.value.trim();

    return input || Date.now();
}

function getRenderOptions(): RenderOptions {
    let element = document.querySelector<SVGElement>('#screen svg')!;

    let currentLocation = getLocation();
    let time = getTime();

    return {
        element,
        tracks: getTracks(currentLocation, time),
        location: currentLocation,
        time,
    };
}

function validate({location, time}: RenderOptions) {
    let valid = location && !isNaN(location.lat) && !isNaN(location.lon) && (
        typeof time === 'number' ||
        !isNaN((time instanceof Date ? time : new Date(time)).getTime())
    );

    document.documentElement.classList.toggle('error', !valid);

    return valid;
}

function render(repeat?: boolean) {
    renderForm();

    let renderOptions = getRenderOptions();

    if (!validate(renderOptions))
        return;

    setDimensions(renderOptions);
    renderHorizon(renderOptions);
    renderDirections(renderOptions);
    renderTracks(renderOptions);
    renderMarkers(renderOptions);
    renderMarkerLines(renderOptions);
    renderPositionLabels(renderOptions);
    renderMoonPhase(renderOptions);

    if (repeat)
        setTimeout(() => render(true), 15000);
}

function init() {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    window.addEventListener('resize', () => {
        if (resizeTimeout !== null)
            clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => render(), 200);
    });

    render(true);
}

init();
