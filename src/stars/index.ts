import {fetchData} from './fetchData';
import {initRotation} from './initRotation';
import {initClicks} from './initClicks';
import {render} from './render';
import {setDimensions} from './setDimensions';
import type {Context} from './Context';

async function init() {
    let element = document.querySelector<SVGElement>('#screen svg')!;
    let data = await fetchData();

    let ctx: Context = {
        ...data,
        element,
        tilt: [-.12, 0],
        mode: document.documentElement.dataset.mode as Context['mode'],
    };

    let resizeRaf: number | null = null;

    window.addEventListener('resize', () => {
        if (resizeRaf !== null)
            cancelAnimationFrame(resizeRaf);

        resizeRaf = requestAnimationFrame(() => {
            setDimensions(ctx);
            render(ctx);
        });
    });

    document.querySelector('#screen form')!.addEventListener('change', event => {
        let target = event.target;

        if (target instanceof HTMLInputElement && target.name === 'mode') {
            let prevMode = ctx.mode;

            document.documentElement.dataset.mode = target.value;
            ctx.mode = target.value as Context['mode'];

            if (ctx.mode === 'fantasy' || prevMode === 'fantasy')
                render(ctx);
        }
    });

    setDimensions(ctx);
    render(ctx);
    initRotation(ctx);
    initClicks(ctx);
}

init();
