export function getDefaultQuery(postfix?: '&') {
    let params = new URLSearchParams(window.location.search);
    let nextParams = new URLSearchParams();

    let u = params.get('u');
    let i = params.get('i');

    if (u)
        nextParams.set('u', u);

    if (i)
        nextParams.set('i', i);

    let query = nextParams.toString();

    return query ? query + (postfix ?? '') : '';
}
