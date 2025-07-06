import type {Context} from './Context';

export function renderForm({q, eg, ge}: Context) {
    let form = document.querySelector('form.input')!;
    let searchInput = form.querySelector<HTMLInputElement>('[name="q"]')!;

    searchInput.value = q;
    form.querySelector<HTMLInputElement>('[name="eg"]')!.checked = eg;
    form.querySelector<HTMLInputElement>('[name="ge"]')!.checked = ge;

    if (!q)
        searchInput.focus();
}
