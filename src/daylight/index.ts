import {getFormInput} from './getFormInput';
import {getTracks} from './getTracks';
import {isValidFormInput} from './isValidFormInput';
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

function render(repeat?: boolean) {
    renderForm();

    let formInput = getFormInput();
    let hasValidInput = isValidFormInput(formInput);

    document.documentElement.classList.toggle('error', !hasValidInput);

    if (!hasValidInput)
        return;

    let renderOptions: RenderOptions = {
        ...formInput,
        element: document.querySelector<SVGElement>('#screen svg')!,
        tracks: getTracks(formInput.location, formInput.time),
    };

    setDimensions(renderOptions);
    renderHorizon(renderOptions);
    renderDirections(renderOptions);
    renderTracks(renderOptions);
    renderMarkers(renderOptions);
    renderMarkerLines(renderOptions);
    renderPositionLabels(renderOptions);
    renderMoonPhase(renderOptions);

    if (repeat && !formInput.time)
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
