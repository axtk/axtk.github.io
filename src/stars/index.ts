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
        // mode: 'van_gogh',
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

    setDimensions(ctx);
    render(ctx);
    initRotation(ctx);
    initClicks(ctx);
}

init();
