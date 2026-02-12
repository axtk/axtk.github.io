{

let toCamelCase = s => {
    return s.split(/[\-_\s]+/)
        .map((item, k) => {
            return k === 0 ? item : item.charAt(0).toUpperCase() + item.substring(1);
        })
        .join('');
};

let layout = window.layout = {
    pickElements() {
        let output = {}, target, id, idChain;
        let elements = document.querySelectorAll('[data-id]');

        for (let i = elements.length - 1; i >= 0; i--) {
            target = output;
            id = elements[i].getAttribute('data-id');
            idChain = id.split('.').map(toCamelCase);

            while (idChain.length) {
                if (idChain.length === 1) {
                    if (target[idChain[0]])
                        console.warn('Collision at [data-id="' + id + '"].');
                    target[idChain[0]] = elements[i];
                }
                else {
                    if (target[idChain[0]] && target[idChain[0]].constructor !== Object)
                        console.warn('Nestedness conflict at [data-id="' + id + '"].');
                    target[idChain[0]] = target[idChain[0]] || {};
                    target = target[idChain[0]];
                }
                idChain.shift();
            }
        }

        return output;
    }
};

}