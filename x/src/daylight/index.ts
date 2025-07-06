import {type FormInput, getFormInput} from './getFormInput';
import {getTracks} from './getTracks';
import {isValidFormInput} from './isValidFormInput';
import {setDimensions} from './setDimensions';
import {renderDirections} from './renderDirections';
import {renderForm} from './renderForm';
import {renderHorizon} from './renderHorizon';
import {renderGrid} from './renderGrid';
import {renderMarkers} from './renderMarkers';
import {renderMarkerLines} from './renderMarkerLines';
import {renderMoonPhase} from './renderMoonPhase';
import {renderPositionLabels} from './renderPositionLabels';
import {renderTracks} from './renderTracks';
import type {Context} from './Context';

type Timeout = ReturnType<typeof setTimeout>;

let renderTimeout: Timeout | null = null;
let formInput: FormInput | null = null;

function render(repeat?: boolean) {
    if (!formInput) {
        renderForm();
        formInput = getFormInput();

        if (!isValidFormInput(formInput)) {
            document.documentElement.classList.add('error');
            return;
        }
    }

    let ctx: Context = {
        ...formInput,
        element: document.querySelector<SVGElement>('#screen svg')!,
        tracks: getTracks(formInput.location, formInput.time),
    };

    setDimensions(ctx);
    renderHorizon(ctx);
    renderGrid(ctx);
    renderDirections(ctx);
    renderTracks(ctx);
    renderMarkers(ctx);
    renderMarkerLines(ctx);
    renderPositionLabels(ctx);
    renderMoonPhase(ctx);

    if (repeat && !formInput.time) {
        if (renderTimeout !== null)
            clearTimeout(renderTimeout);

        renderTimeout = setTimeout(() => render(true), 15000);
    }
}

function init() {
    let resizeTimeout: Timeout | null = null;

    window.addEventListener('resize', () => {
        if (resizeTimeout !== null)
            clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => render(), 200);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible')
            render(true);
        else if (renderTimeout !== null)
            clearTimeout(renderTimeout);
    });

    render(true);
}

init();
