import {fetchData} from './fetchData';
import {initRotation} from './initRotation';
import {initClicks} from './initClicks';
import {hideMenu} from './hideMenu';
import {render} from './render';
import {renderForm} from './renderForm';
import {setDimensions} from './setDimensions';
import {state} from './state';
import type {Context} from './Context';

const defaultTilt: [number, number] = [
    // -.12, 0 // r .52 Ori
    // 1.2, 1.25 // r .52 UMa Umi
    1.7, 1.05 // r .65 UMa
];

async function init() {
    let element = document.querySelector<SVGElement>('#screen svg')!;
    let data = await fetchData();
    let mode = state.read<Context['mode']>('mode') ??
        document.documentElement.dataset.mode as Context['mode'];

    let ctx: Context = {
        ...data,
        element,
        tilt: state.read('tilt') ?? defaultTilt,
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

    window.sendEvent?.(['load mode', mode]);
}

init();
