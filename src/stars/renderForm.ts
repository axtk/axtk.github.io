import {render} from './render';
import {state} from './state';
import type {Context} from './Context';

export function renderForm(ctx: Context) {
    let form = document.querySelector('#screen form')!;

    for (let control of form.querySelectorAll<HTMLInputElement>('[name="mode"]'))
        control.checked = control.value === ctx.mode;

    form.addEventListener('change', event => {
        let target = event.target;

        if (target instanceof HTMLInputElement && target.name === 'mode') {
            let prevMode = ctx.mode;
            let nextMode = target.value as Context['mode'];

            document.documentElement.dataset.mode = nextMode;
            ctx.mode = nextMode;

            if (nextMode === 'fantasy' || prevMode === 'fantasy')
                render(ctx);

            state.write('mode', nextMode);
            window.sendEvent?.(['set mode', nextMode]);
        }
    });
}
