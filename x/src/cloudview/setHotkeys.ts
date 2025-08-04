const keyMap: Record<string, string> = {
    ArrowLeft: 'prev',
    ArrowRight: 'next',
    Escape: 'quit',
    Home: 'start',
    End: 'end',
};

export function setHotkeys() {
    window.addEventListener('keyup', event => {
        let key = keyMap[event.code];
        let link = key === undefined
            ? undefined
            : document.querySelector<HTMLLinkElement>(`a[href][data-key="${key}"]`)?.href;

        if (link) window.location.assign(link);
    });
}
