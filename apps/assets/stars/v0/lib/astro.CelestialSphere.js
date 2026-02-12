{

const DATA_LOCATION = 'https://raw.githubusercontent.com/axtk/axtk.github.io/refs/heads/main/apps/assets/stars/v0/data';

let astro = window.astro = window.astro || {};

const spectralClassColorMap = {
    'O': '#c0ffff', // blue
    'B': '#c0ffff', // blue
    'A': '#ffffff', // white
    'F': '#ffffff', // white
    'G': '#ffffc0', // yellow
    'K': '#ffe0c0', // orange
    'M': '#ffc0c0'  // red
};

const bayerDesignationMap = {
    'alp': '\u03b1', 'bet': '\u03b2', 'gam': '\u03b3',
    'del': '\u03b4', 'eps': '\u03b5', 'zet': '\u03b6',
    'eta': '\u03b7', 'the': '\u03b8', 'iot': '\u03b9',
    'kap': '\u03ba', 'lam': '\u03bb', 'mu':  '\u03bc',
    'nu':  '\u03bd', 'xi':  '\u03be', 'omi': '\u03bf',
    'pi':  '\u03c0', 'rho': '\u03c1', 'sig': '\u03c3',
    'tau': '\u03c4', 'ups': '\u03c5', 'phi': '\u03c6',
    'chi': '\u03c7', 'psi': '\u03c8', 'ome': '\u03c9',
    'omg': '\u03c9'
};

const colorMap = {};

Object.keys(spectralClassColorMap).forEach(key => {
    colorMap[key] = graphics.color.toComponents(spectralClassColorMap[key]).join(',');
});

const superscriptNumbers = [
    '\u2070', '\u00b9', '\u00b2', '\u00b3', '\u2074',
    '\u2075', '\u2076', '\u2077', '\u2078', '\u2079'
];

let util = {
    toSup(x) {
        return String(x).split('')
            .map(character => superscriptNumbers[+character])
            .filter(Boolean).join('');
    },
    getStarName(star) {
        let name = '';
        if (star[7]) name += star[7][1] +
            (star[7][2] ? ('<sup>' + star[7][2] + '</sup>') : '') + ' ' + star[7][0];
            // (star[7][2] ? this.toSup(star[7][2]) : '') + ' ' + star[7][0];
        if (star[8]) name = star[8] + ', ' + name;
        if (!name && star[4]) name = String(star[4]);
        return name;
    },
    toRA(x) {
        let hx = 12*x/Math.PI, h = Math.floor(hx);
        let mx = 60*(hx - h), m = Math.floor(mx);
        let sx = 60*(mx - m), s = sx.toFixed(2);
        return `${h}ʰ\u202f${m}\'\u202f${s}\"`;
    },
    toDec(x) {
        let dx = 180*Math.abs(x)/Math.PI, d = Math.floor(dx);
        let mx = 60*(dx - d), m = Math.floor(mx);
        let sx = 60*(mx - m), s = sx.toFixed(2);
        return (x < 0 ? '-' : '') + `${d}°\u202f${m}\'\u202f${s}\"`;
    }
};

let styles = {
    NIGHT: {
        GRID_COLOR: '#5c3d99',
        // GRID_COLOR: graphics.color.toRGBA('#96f', .6),
        STAR_LABEL_COLOR: graphics.color.toRGBA('#96f', .5),
        CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#96f', .15),
        // GRID_COLOR: graphics.color.toRGBA('#039', .25),
        // STAR_LABEL_COLOR: graphics.color.toRGBA('#96f', .4),
        // CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#96f', .045),
        FACTORS: [window.devicePixelRatio > 1 ? .6 : .5, .75],
        // 2024-07-16 enables star beams only in dark mode
        BEAMS: true
    },
    CHART: {
        GRID_COLOR: '#7f7f7f',
        // GRID_COLOR: graphics.color.toRGBA('#000', .5),
        STAR_LABEL_COLOR: graphics.color.toRGBA('#000', .5),
        CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#000', .1),
        STAR_COLOR_COMPONENTS: '64,64,64',
        // GRID_COLOR: '#ccc',
        // STAR_LABEL_COLOR: graphics.color.toRGBA('#000', .35),
        // CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#000', .045),
        // STAR_COLOR_COMPONENTS: '64,64,64',
        FACTORS: [.65, .01] // [.75, .6]
    }
};

let CelestialSphere = function() {
    math3D.shape.Sphere.apply(this, arguments);
    this.transparent = false;
    this.style = styles.NIGHT;
};

Object.assign(CelestialSphere, util, { styles });

Object.assign(CelestialSphere.prototype, math3D.shape.Sphere.prototype, {
    draw(g) {
        this.drawConstellationLabels(g);
        this.drawGrid(g);
        this.drawStars(g);
    },
    setGridStyle(g) {
        g.setLineDash([]);
        g.strokeStyle = this.style.GRID_COLOR;
        g.lineWidth = .2;
    },

    drawStars(g) {
        if (this.stars) {
            this.setStarStyle(g);
            this.stars.forEach((star, k) => this.drawStar(g, star, k));
        }
        else this.fetchStars().then(() => this.drawStars(g));
    },
    setStarStyle(g) {
        if (this.style.setStarStyle)
            return this.style.setStarStyle(g);
        g.lineWidth = .2;
    },
    drawStar(g, star, k) {
        let point = this.transform({ r: this.radius, phi: star[0], theta: star[1] });
        if (!this.visible(g, point)) return;

        if (this.style.drawStar)
            return this.style.drawStar(g, star, point, k);

        let q = this.style.FACTORS;
        let color = this.style.STAR_COLOR_COMPONENTS || star[5];
        let radius = q[0]*(6.5 - star[3]), r = radius, beam = radius + 1;

        if (r > 2 && this.style.BEAMS) {
            g.strokeStyle = 'rgba(' + color + ',.75)';
            g.beginPath();
            g.moveTo(point[0] - beam, point[1]);
            g.lineTo(point[0] + beam, point[1]);
            g.moveTo(point[0], point[1] - beam);
            g.lineTo(point[0], point[1] + beam);
            g.stroke();
        }
        while (r > 0) {
            g.fillStyle = 'rgba(' + color + ',' + (1 - q[1]*r/radius) + ')';
            g.beginPath();
            g.arc(point[0], point[1], r--, 0, 2*Math.PI);
            g.fill();
        }
        if (star[3] < 3.51) this.drawStarLabel(g, star, point, radius, k);
    },
    drawStarLabel(g, star, point, radius, k) {
        if (!star[7] || !star[7][1]) return;

        let x = point[0] + radius + 4, y = point[1] + 3;
        // let primaryFont = 'normal 11px/1.4 Helvetica, Arial, sans-serif';
        let primaryFont = 'normal 13px/1.4 Times New Roman, serif';

        g.fillStyle = this.style.STAR_LABEL_COLOR;
        g.font = primaryFont;
        g.fillText(star[7][1], x, y);

        if (star[7][2]) {
            x += g.measureText(star[7][1]).width;
            // g.font = 'normal 8px/1.4 Helvetica, Arial, sans-serif';
            g.font = 'normal 10px/1.4 Times New Roman, serif';
            g.fillText(star[7][2], x, y - 4);
        }
    },
    fetchStars() {
        if (this.stars) return Promise.resolve();
        this.stars = [];
        return fetch(`${DATA_LOCATION}/stars_m6.json`)
            .then(response => response.json())
            .then(data => { this.stars = this.preprocessStars(data); });
    },
    preprocessStars(stars) {
        stars.forEach(star => {
            star.splice(1, 0, Math.PI/2 - star[1]);
            star.splice(5, 0, colorMap[(star[5] || '').charAt(0)]);
            if (star[7]) {
                // 'Algedi, alp2 Cap' > ['Cap', 'α', '2'], 'Algedi'
                let nameComponents = star[7].match(/^(([^,]+),\s*)?([a-z]{2,3}|\d+)(\d*)\s+(.+)$/);
                if (nameComponents) {
                    let bayerDesignation = bayerDesignationMap[nameComponents[3]];
                    if (bayerDesignation) nameComponents[3] = bayerDesignation;
                    star[7] = [5, 3, 4].map(k => nameComponents[k]).filter(Boolean);
                    if (nameComponents[2]) star.splice(8, 0, nameComponents[2]);
                }
            }
        });
        return stars;
    },

    drawConstellationLabels(g) {
        if (this.constellationLabels)
            this.constellationLabels.forEach((label, k) => this.drawConstellationLabel(g, label, k));
        else this.fetchConstellationLabels().then(() => this.drawConstellationLabels(g));
    },
    drawConstellationLabel(g, label, k) {
        let point = this.transform({ r: this.radius, phi: label[0], theta: label[1] });

        if (point[2] >= 0 || this.transparent) {
            let labelText = /* label[4] || */ label[3];
            let font = 'bold 32px/1.4 Helvetica, Arial, sans-serif';

            g.fillStyle = this.style.CONSTELLATION_LABEL_COLOR;
            g.font = font;
            g.fillText(labelText, point[0] - g.measureText(labelText).width/2, point[1] + 8);
        }
    },
    fetchConstellationLabels() {
        if (this.constellationLabels) return Promise.resolve();
        this.constellationLabels = [];
        return fetch(`${DATA_LOCATION}/constellation_labels.json`)
            .then(response => response.json())
            .then(data => { this.constellationLabels = this.preprocessPositions(data); });
            // .then(() => this.fetchContellationNames());
    },

    fetchContellationNames() {
        return fetch(`${DATA_LOCATION}/constellation_names.json`)
            .then(response => response.json())
            .then(data => {
                this.constellationLabels.forEach(label => {
                    if (data[label[3]]) label[4] = data[label[3]];
                });
            });
    },
    preprocessPositions(data) {
        data.forEach(item => item.splice(1, 0, Math.PI/2 - item[1]));
        return data;
    },

    point(point) {
        if (typeof point === 'function') {
            this.pointHandler = point;
            return;
        }

        let neighbors = [];

        this.stars.forEach(star => {
            let objectPosition = this.transform({ r: this.radius, phi: star[0], theta: star[1] });
            let near = (
                objectPosition[2] >= 0 &&
                Math.abs(objectPosition[0] - point[0]) < 7 &&
                Math.abs(objectPosition[1] - point[1]) < 7
            );
            if (near) neighbors.push(star);
        });

        if (this.pointHandler) this.pointHandler(point, neighbors);
        return false;
    }
});

astro.CelestialSphere = CelestialSphere;

}