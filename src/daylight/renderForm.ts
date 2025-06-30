import type {GeoLocation} from './astronomy/GeoLocation';

function getCurrentLocation(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation)
            return reject(new Error('Geolocation is not supported by the browser.'));
        
        navigator.geolocation.getCurrentPosition(
            position => {
                if (!position || !position.coords)
                    return reject(new Error('Failed to retrieve current location.'));
                
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            () => {
                reject(new Error(
                    'Failed to retrieve current location.\n' +
                    'Make sure geolocation is enabled.'
                ));
            }
        );
    });
}

const defaultValues: Record<string, string> = {
    p: '55.76° N, 37.62° E',
};

export function renderForm() {
    let params = new URLSearchParams(window.location.search);

    for (let name of ['p', 't']) {
        let value = (params.get(name) ?? '').trim();
        let field = document.querySelector(`form [name="${name}"]`);

        if (field instanceof HTMLInputElement)
            field.value = value || (defaultValues[name] ?? '');
    }

    let locationButton = document.querySelector('#set-current-location');

    if (locationButton)
        locationButton.addEventListener('click', () => {
            getCurrentLocation()
                .then(location => {
                    let {searchParams} = new URL(window.location.href);

                    searchParams.set('p', `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`);

                    window.location.search = searchParams.toString();
                })
                .catch(error => {
                    alert(error.message);
                });
        });
}
