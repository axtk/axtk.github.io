import {events} from './events';

function removeEmptySegments() {
    let {href, pathname, hash} = window.location;
    let nextLocation = '';

    if (/(\?#?|\??#)$/.test(href))
        nextLocation = pathname;
    else if (/\?#.+$/.test(href))
        nextLocation = pathname + hash;

    if (window.history && nextLocation)
        window.history.pushState(null, '', nextLocation);
}

function discardHash() {
    let {pathname, search, hash} = window.location;

    if (window.history && hash)
        setTimeout(() => {
            window.history.pushState(null, '', pathname + search);
        }, 2000);
}

function setNameParam() {
    events.addListener('render', () => {
        if (!document.documentElement.classList.contains('standalone'))
            return;

        let name = document.querySelector<HTMLElement>('figure[data-name]')?.dataset.name;
        let {href, searchParams} = new URL(window.location.href);

        if (window.history && name && searchParams.get('name') !== name)
            window.history.replaceState({}, '', `${href}&name=${encodeURIComponent(name)}`);
    });
}

export function updateURL() {
    setNameParam();
    removeEmptySegments();
    discardHash();
}
