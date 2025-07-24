const dataRoot = 'https://raw.githubusercontent.com/axtk/axtk.github.io/refs/heads/main/x/assets/stars/data';

export const urlMap = {
    stars: `${dataRoot}/stars_m6.csv`,
    constellationLabels: `${dataRoot}/constellation_labels.csv`,
    constellationNames: `${dataRoot}/constellation_names.json`,
    constellationLines: `${dataRoot}/constellation_lines.json`,
};

export const ns = 'http://www.w3.org/2000/svg';

export const bayerDesignationMap: Record<string, string> = {
    alp: '\u03b1', bet: '\u03b2', gam: '\u03b3',
    del: '\u03b4', eps: '\u03b5', zet: '\u03b6',
    eta: '\u03b7', the: '\u03b8', iot: '\u03b9',
    kap: '\u03ba', lam: '\u03bb', mu:  '\u03bc',
    nu:  '\u03bd', xi:  '\u03be', omi: '\u03bf',
    pi:  '\u03c0', rho: '\u03c1', sig: '\u03c3',
    tau: '\u03c4', ups: '\u03c5', phi: '\u03c6',
    chi: '\u03c7', psi: '\u03c8', ome: '\u03c9',
    omg: '\u03c9'
};

export const superscriptNumbers = [
    '\u2070', '\u00b9', '\u00b2', '\u00b3', '\u2074',
    '\u2075', '\u2076', '\u2077', '\u2078', '\u2079'
];
