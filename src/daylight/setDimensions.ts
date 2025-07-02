import type {Context} from './Context';

export function setDimensions({element}: Context) {
    let container = element.parentElement;

    if (!container)
        return;

    element.setAttribute('style', 'display: none');

    let {width, height} = container.getBoundingClientRect();

    element.setAttribute('width', String(width));
    element.setAttribute('height', String(height));
    element.setAttribute('viewBox', `0 0 ${width} ${height}`);
    element.setAttribute('data-size', Math.random().toString(36).slice(2));

    element.removeAttribute('style');
}
