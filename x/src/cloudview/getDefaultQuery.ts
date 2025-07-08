export function getDefaultQuery(postfix?: '&') {
    let params = new URLSearchParams(window.location.search);
    let nextParams = new URLSearchParams();

    let u = params.get('u');
    let i = params.get('i');
    let t = params.get('t');

    if (u)
        nextParams.set('u', u);

    if (i)
        nextParams.set('i', i);

    if (t)
        nextParams.set('t', t);

    let query = nextParams.toString();

    return query ? query + (postfix ?? '') : '';
}
