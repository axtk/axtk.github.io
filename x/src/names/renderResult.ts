import type {Context} from './Context';
import {renderCharHint} from './renderCharHint';
import {transformInput} from './transformInput';

export function renderResult(ctx: Context) {
    let {q, config} = ctx;
    let baseDocumentTitle = document.title.split('/').at(-1)?.trim() ?? '';

    if (!q) {
        document.documentElement.dataset.output = 'none';
        document.title = baseDocumentTitle;
        return;
    }

    let container = document.querySelector('.output')!;
    let {output, uppercaseOutput, unstressedInput} = transformInput(q, config);

    container.querySelector('.result strong')!.innerHTML = output;

    let uppercasedContainer = container.querySelector('.result .uppercased')!;

    uppercasedContainer.innerHTML = uppercaseOutput;
    uppercasedContainer.toggleAttribute('hidden', output === uppercaseOutput);

    container.querySelector<HTMLLinkElement>('a.unstress')!.href =
        `?q=${encodeURIComponent(unstressedInput)}`;

    document.documentElement.dataset.output =
        q === unstressedInput ? 'unstressed' : 'stressed';
    document.title = `${q} латиницей / ${baseDocumentTitle}`;

    renderCharHint(output, ctx);
}
