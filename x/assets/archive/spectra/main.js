{

const DATA_LOCATION = 'https://raw.githubusercontent.com/axtk/axtk.github.io/refs/heads/main/x/assets/archive/spectra';

const lineColor = '#48e';

let E = layout.pickElements();
let storage = {};

let analyzeTransmittance = data => {
    if (data === undefined) data = tabular.toDataArray(E.initial.data.value);

    if (!data) return alert('Initial spectrum is missing');
    storage.initial = data;

    let transmittance = {
        data: data,
        spline: ftir.getTransmittanceSpline(data),
        level: ftir.getTransmittanceLevel(data)
    };
    let reflectance = ftir.getReflectance(transmittance.spline, 'spline');

    return Promise.resolve({ transmittance, reflectance });
};

let renderTransmittance = data => {
    let updateRequired = data !== undefined;
    if (data === undefined) data = tabular.toDataArray(E.initial.data.value);

    if (!data) return alert('Initial spectrum is missing');
    storage.initial = data;

    E.initial.data.classList.add('hidden');
    E.initial.plot.classList.remove('hidden');

    $(E.initial.plot).plot([{
        data: data,
        lines: { show: true, lineWidth: 1 },
        points: { show: false }, color: '#69f'
    }]);

    if (updateRequired)
        E.initial.data.value = tabular.toPlainText(data);

    E.reflectance.value = '';
    E.converted.data.value = '';
    E.absorbance.data.value = '';
    $(E.absorbance.plot).plot([{}]);

    return Promise.resolve(data);
};

let renderAnalyzedTransmittance = data => {
    let updateRequired = data !== undefined;
    if (data === undefined) data = tabular.toDataArray(E.initial.data.value);

    if (!data) return alert('Initial spectrum is missing');

    E.initial.data.classList.add('hidden');
    E.initial.plot.classList.remove('hidden');

    $(E.initial.plot).plot([
        {
            data: data.transmittance.data,
            lines: { show: true, lineWidth: 1 },
            points: { show: false }, color: lineColor
        },
        /*{
            data: data.transmittance.spline,
            lines: { show: true, lineWidth: 2 },
            // splines: { show: true, fill: false },
            points: { show: false }, color: 'rgba(51,204,51,.2)',
            shadowSize: 0
        },*/
        {
            data: data.transmittance.level,
            // lines: { show: true, lineWidth: 1 },
            dashes: { show: true, lineWidth: 1, dashLength: 6 },
            points: { show: false }, color: '#c3c'
        }
    ]);

    if (updateRequired)
        E.initial.data.value = tabular.toPlainText(data.transmittance.data);

    E.reflectance.value = data.reflectance;

    return Promise.resolve(storage.analyzed = data);
};

let pickConversionData = data => {
    if (!data) {
        if (storage.analyzed) data = storage.analyzed;
        else {
            if (!storage.initial) storage.initial = tabular.toDataArray(E.initial.data.value);
            data = { transmittance: { data: storage.initial } };
        }
    }

    let reflectance = E.reflectance.value;

    data.reflectance = reflectance ? parseFloat(reflectance) : data.reflectance;
    data.thickness = parseFloat(E.thickness.value)*ftir.MICRON;

    return Promise.resolve(data);
};

let convert = data => {
    if (!ftir.valid(data))
        return alert('Thickness of film and/or reflectance are invalid');

    let absorbance = ftir.toAbsorbance(data.transmittance.data, data);
    return Promise.resolve(storage.converted = absorbance);
};

let renderAbsorbance = data => {
    if (data === undefined) data = storage.converted || storage.initial;

    E.absorbance.plot.classList.remove('hidden');

    $(E.absorbance.plot).plot([{
        data: data,
        lines: { show: true, lineWidth: 1 },
        points: { show: false }, color: lineColor
    }]);

    E.converted.data.classList.remove('hidden');
    E.converted.data.value = tabular.toPlainText(data);
    E.absorbance.data.value = '';

    return Promise.resolve(data);
};

let pickAbsorbanceData = data => {
    if (data === undefined)
        data = storage.converted || storage.initial || tabular.toDataArray(E.initial.data.value);

    if (E.peaks.data.classList.contains('intact')) {
        return fetch(`${DATA_LOCATION}/ir_peaks.csv`)
            .then(response => response.text())
            .then(s => {
                return s.split(/\r?\n/).filter(Boolean).map(s => {
                    let [k, ...def] = s.split(',')
                        .map(x => x.startsWith('"') && x.endsWith('"') ? x.slice(1, -1) : x);
                    return [Number(k), ...def];
                });
            })
            .then(peakTable => {
                E.peaks.data.value = tabular.toPlainText(peakTable);
                E.peaks.data.classList.remove('intact');
                return { absorbance: data, peakTable };
            });
    }

    let peakTable = tabular.toDataArray(E.peaks.data.value) || storage.peakTable;
    return Promise.resolve({ absorbance: data, peakTable });
};

let getAbsorbancePeaks = data => {
    if (!data || !data.absorbance)
        return alert('Absorbance spectrum is missing');

    if (!data.peakTable)
        return alert('Absorbance peak reference data set is missing');

    let peaks = ftir.getPeaks(data.absorbance);
    let identifiedPeaks = ftir.match(data.peakTable, peaks, { dx: 20, crossref: 1 });

    return Promise.resolve({ absorbance: data.absorbance, peaks, identifiedPeaks });
};

let renderAbsorbancePeaks = data => {
    E.absorbance.plot.classList.remove('hidden');

    $(E.absorbance.plot).plot([
        {
            data: data.absorbance,
            lines: { show: true, lineWidth: 1 },
            points: { show: false }, color: lineColor
        },
        {
            data: data.peaks,
            lines: { show: false, lineWidth: 1 },
            points: { show: true }, color: '#c3c'
        }
    ]);

    E.absorbance.data.classList.remove('hidden');
    E.absorbance.data.value = tabular.toPlainText(data.identifiedPeaks);
};

fetch(`${DATA_LOCATION}/ir_spectrum.csv`)
    .then(response => response.text())
    .then(s => s.split(/\r?\n/).filter(Boolean).map(x => x.split(',').map(Number)))
    .then(analyzeTransmittance)
    .then(renderAnalyzedTransmittance)
    .then(pickConversionData)
    .then(convert)
    .then(renderAbsorbance)
    .then(pickAbsorbanceData)
    .then(getAbsorbancePeaks)
    .then(renderAbsorbancePeaks);


E.initial.edit.addEventListener('click', event => {
    event.preventDefault();
    E.initial.plot.classList.toggle('hidden');
    E.initial.data.classList.toggle('hidden');
});

E.initial.submit.addEventListener('click', event => {
    event.preventDefault();
    E.initial.plot.classList.toggle('hidden');
    E.initial.data.classList.toggle('hidden');
    renderTransmittance();
});

E.analyze.addEventListener('click', event => {
    event.preventDefault();
    analyzeTransmittance()
        .then(renderAnalyzedTransmittance);
});

E.convert.addEventListener('click', event => {
    event.preventDefault();
    pickConversionData()
        .then(convert)
        .then(renderAbsorbance);
});

E.peaks.edit.addEventListener('click', event => {
    event.preventDefault();
    E.peaks.data.classList.toggle('hidden');
});

E.peaks.identify.addEventListener('click', event => {
    event.preventDefault();
    pickAbsorbanceData()
        .then(getAbsorbancePeaks)
        .then(renderAbsorbancePeaks);
});

document.addEventListener('click', event => {
    let control = event.target.closest('a[data-id]');
    if (control) window.sendEvent?.(['click button', control.dataset.id]);
});

let details = document.querySelector('details');

details.addEventListener('toggle', () => {
    window.sendEvent?.(['toggle intro', `toggle ${details.open ? 'open' : 'closed'}`]);
});

}
