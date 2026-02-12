/*! AT MMXII, MMXVII */
{

const SQRT_2 = Math.sqrt(2);
const LOG_10 = Math.log(10);

let log10 = x => Math.log(x)/LOG_10;

let ftir = window.ftir = {

    MICRON: 1e-6, // SI

    // data: (wavenumber [k, cm^-1], transmittance [T, %])
    getReflectance(data, type) {
        let spline = type === 'spline' ? data : this.getTransmittanceSpline(data);
        return spline ? 1 - regression.max(spline, 1)/100 : Number.NaN;
    },

    getTransmittanceSpline(data) {
        return regression.getLinearSpline(data, { knots: 15 });
    },

    getTransmittanceLevel(data) {
        let spline = this.getTransmittanceSpline(data);
        let reflectance = this.getReflectance(spline, 'spline');
        
        if (data && data.length && !Number.isNaN(reflectance)) {
            let t = (1 - reflectance)*100;
            return [
                [data[0][0], t],
                [data[data.length - 1][0], t]
            ];
        }
    },

    getPeaks(data) {
        if (!regression.valid(data))
            return null;
        
        let spline = regression.getLinearSpline(data, { knots: .1*data.length });
        let roughExtrema = regression.getExtremalValues(spline);
        let roughPeaks = this.filterPeaks(roughExtrema, { q: .01 });
        
        let extremalValues = regression.getExtremalValues(data);
        let peaks = this.filterPeaks(extremalValues, { q: .05 });
        let selectedPeaks = this.match(peaks, roughPeaks, { dx: 20 });

        return selectedPeaks;
    },

    toAbsorbance(transmittance, options) {
        if (!options || !regression.valid(transmittance) || !this.valid(options))
            return null;
            
        let absorbance = new Array(transmittance.length);
        let q = 100*(1 - options.reflectance)*(1 - options.reflectance);
        let w = 2*SQRT_2*options.thickness;
        
        for (let i = 0; i < transmittance.length; i++) {
            absorbance[i] = [
                transmittance[i][0],
                -log10(transmittance[i][1]/q)/w
            ];
        }
        
        return absorbance;
    },

    filterPeaks(data, options) {
        if (!regression.valid(data) || !options || options.q === undefined)
            return null;
        
        let filtered = [];
        let h = regression.max(data, 1) - regression.min(data, 1);
        let dy = options.q*h;
        
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                if (data[i][1] > data[i + 1][1] + dy) filtered.push(data[i]);
            }
            else if (i === data.length - 1) {
                if (data[i][1] > data[i - 1][1] + dy) filtered.push(data[i]);
            }
            else {
                if (data[i][1] > data[i + 1][1] + dy || data[i][1] > data[i - 1][1] + dy)
                    filtered.push(data[i]);
            }
        }
        
        return filtered;
    },

    // preciser data1 is matched against rougher and less populated data2
    match(data1, data2, options) {
        if (!regression.valid(data1) || !regression.valid(data2) || !options || options.dx === undefined)
            return null;
        
        let matched = [], dx, dxj, k;
        
        for (let i = 0; i < data2.length; i++) {
            dx = Math.abs(data2[i][0] - data1[0][0]); k = -1;
            for (let j = 0; j < data1.length; j++) {
                dxj = Math.abs(data2[i][0] - data1[j][0]);
                if (dxj <= dx) { dx = dxj; k = j; }
            }
            if (options.crossref) {
                if (k != -1 && dx < options.dx)
                    matched.push(data2[i].concat(data1[k]));
                else matched.push(data2[i]);
            }
            else if (k != -1 && dx < options.dx)
                matched.push(data1[k]);
        }
        
        return matched;
    },

    valid(options) {
        return !options || (
            typeof options.thickness === 'number' && !Number.isNaN(options.thickness) &&
            options.thickness > 0 &&
            typeof options.reflectance === 'number' && !Number.isNaN(options.reflectance) &&
            options.reflectance >= 0 && options.reflectance < 1
        );
    }

};

}