{

let graphics = window.graphics = window.graphics || {};

graphics.color = {
    toComponents(color, opacity) {
        let components = /^#?\w{3}$/.test(color) ?
            (color.match(/[\w\d]{1}/g) || []).map(component => parseInt(component + component, 16)) :
            (color.match(/[\w\d]{2}/g) || []).map(component => parseInt(component, 16));
        if (opacity !== undefined) components.push(opacity);
        return components;
    },
    toRGBA(color, opacity) {
        return 'rgba(' + this.toComponents(color, opacity).join(',') + ')';
    }
};

}