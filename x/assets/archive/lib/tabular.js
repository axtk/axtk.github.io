{

let castValue = x => {
    let n = parseFloat(x);
    return Number.isNaN(n) ? x : n;
};

let tabular = window.tabular = {
    toPlainText(data) {
        if (!data || !data.length || !data[0].length)
            return '';
        return data.map(item => item.join('\t')).join('\n');
    },
    toDataArray(text) {
        if (!text) return null;
        return text.split(/\r?\n/)
            .map(line => line ? line.split(/\s+/).map(castValue) : null)
            .filter(Boolean);
    }
};

}