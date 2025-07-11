{

const DATA_LOCATION = 'https://raw.githubusercontent.com/axtk/axtk.github.io/refs/heads/main/x/assets/archive/tmm';

let plot = {
    potential: document.querySelector('.plot[data-id="potential"]'),
    transmittance: document.querySelector('.plot[data-id="transmittance"]')
};

let dataContainer = {
    potential: document.querySelector('textarea[data-id="potential"]'),
    transmittance: document.querySelector('textarea[data-id="transmittance"]')
};

let control = {
    potential: {
        edit: document.querySelector('[data-action="edit_potential"]'),
        submit: document.querySelector('[data-action="submit_potential"]')
    },
    transmittance: {
        compute: document.querySelector('[data-action="compute_transmittance"]'),
        retrieve: document.querySelector('[data-action="retrieve_transmittance"]')
    },
    processIndicator: document.querySelector('[data-id="processing"]')
};

let storage = {};

let submitPotential = data => {
    if (data) dataContainer.potential.value = tabular.toPlainText(data);
    else data = tabular.toDataArray(dataContainer.potential.value);

    $(plot.transmittance).plot([{}]);
    dataContainer.transmittance.value = '';

    return Promise.resolve(storage.potential = data);
};

let computeTransmittance = data => {
    if (data === undefined) data = storage.potential;
    if (!data) return console.log('Potential profile data are missing');

    control.processIndicator.classList.remove('hidden');

    return new Promise(resolve => {
        setTimeout(() => {
            control.processIndicator.classList.add('hidden');
            resolve(tmm.run(data));
        }, 200);
    });
};

let renderPotential = data => {
    dataContainer.potential.classList.add('hidden');
    plot.potential.classList.remove('hidden');

    $(plot.potential).plot([{
        data: data,
        label: 'U(x) – Potential profile',
        lines: { show: true },
        points: { show: false },
        color: '#c3f'
    }]);

    return Promise.resolve(data);
};

let renderTransmittance = data => {
    plot.transmittance.classList.remove('hidden');
    dataContainer.transmittance.value = tabular.toPlainText(data);

    $(plot.transmittance).plot([{
        data: data,
        label: 'T(E) – Transmittance',
        lines: { show: true },
        points: { show: false },
        color: '#c3f'
    }], { legend: { position: "se" } });

    return Promise.resolve(data);
};

control.potential.edit.addEventListener('click', event => {
    event.preventDefault();
    plot.potential.classList.toggle('hidden');
    dataContainer.potential.classList.toggle('hidden');
});

control.potential.submit.addEventListener('click', event => {
    event.preventDefault();
    submitPotential().then(renderPotential);
});

control.transmittance.compute.addEventListener('click', event => {
    event.preventDefault();
    computeTransmittance().then(renderTransmittance);
});

control.transmittance.retrieve.addEventListener('click', event => {
    event.preventDefault();
    dataContainer.transmittance.classList.toggle('hidden');
});

fetch(`${DATA_LOCATION}/barriers.json`)
    .then(response => response.json())
    .then(submitPotential)
    .then(renderPotential)
    .then(computeTransmittance)
    .then(renderTransmittance);

document.addEventListener('click', event => {
    let control = event.target.closest('[data-action]');
    if (control) window.sendEvent?.(['click_button', control.dataset.action]);
});

let details = document.querySelector('details');

details.addEventListener('toggle', () => {
    window.sendEvent?.(['toggle intro', `toggled ${details.open ? 'open' : 'closed'}`]);
});

}