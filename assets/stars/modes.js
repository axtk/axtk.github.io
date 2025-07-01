{

const DEFAULT_MODE = 'night';

function setMode(mode, { pushState, setToggle }) {
    app.sphere.style = astro.CelestialSphere.styles[mode.toUpperCase()];
    app.screen.clear();
    app.sphere.draw(app.screen.context);

    document.body.dataset.mode = mode;

    if (window.history && pushState !== false) {
        let nextPath = window.location.pathname + (mode === DEFAULT_MODE ? '' : '?mode=' + mode);
        window.history.pushState(null, '', nextPath);
    }

    if (setToggle !== false) {
        [...document.querySelectorAll('input[name="mode"]')].forEach(e => {
            e.checked = e.value === mode;
        });
    }
}

function getCurrentMode() {
    return (location.search.match(/[\?&]mode=([^&]+)/) || [])[1] || DEFAULT_MODE;
}

window.addEventListener('click', event => {
    if (event.target.matches('input[name="mode"]')) {
        let control = document.querySelector('input[name="mode"]:checked');
        if (control && control.value) setMode(control.value, { setToggle: false });
    }
});

setMode(getCurrentMode(), { pushState: false });

window.addEventListener('popstate', () => {
    setMode(getCurrentMode(), { pushState: false });
});

}