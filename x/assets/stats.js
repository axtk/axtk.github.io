if (window.location.protocol === "https:") {
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
}
else {
    window.ym = function(id, method, params) {
        console.log("ym", id, method, params);
    };
}

ym(102234416, "init", {clickmap: true, trackLinks: true, accurateTrackBounce: true});

window.sendParams = function(key, value) {
    let keys = Array.isArray(key) ? key : String(key).split(".");
    let params = {}, p = params, lastKey = keys.pop();
    for (let k of keys) p[k] = (p = {});
    if (lastKey) p[lastKey] = value;
    // https://yandex.ru/support/metrica/data/visit-params-data.html
    ym(102234416, "params", params);
};

window.sendEvent = function(key, prefix) {
    let keys = Array.isArray(key) ? key : String(key).split(".");
    let lastKey = keys.pop();
    window.sendParams([prefix || window.location.pathname, ...keys], lastKey);
};