import {fetchData} from './fetchData';
import {initRotation} from './initRotation';
import {initClicks} from './initClicks';
import {hideMenu} from './hideMenu';
import {render} from './render';
import {renderForm} from './renderForm';
import {setDimensions} from './setDimensions';
import {state} from './state';
import type {Context} from './Context';

async function init() {
    let element = document.querySelector<SVGElement>('#screen svg')!;
    let data = await fetchData();
    let mode = state.read<Context['mode']>('mode') ??
        document.documentElement.dataset.mode as Context['mode'];

    let ctx: Context = {
        ...data,
        element,
        tilt: state.read('tilt') ?? [-.12, 0],
        mode,
    };

    if (document.documentElement.dataset.mode !== mode)
        document.documentElement.dataset.mode = mode;

    let resizeRaf: number | null = null;

    window.addEventListener('resize', () => {
        if (resizeRaf !== null)
            cancelAnimationFrame(resizeRaf);

        resizeRaf = requestAnimationFrame(() => {
            hideMenu();
            setDimensions(ctx);
            render(ctx);
        });
    });

    setDimensions(ctx);
    renderForm(ctx);
    render(ctx);
    initRotation(ctx);
    initClicks(ctx);
}

init();
