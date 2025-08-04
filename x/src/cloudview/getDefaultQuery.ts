const keys = ['url', 'path', 'tag', 'index'];

export function getDefaultQuery(postfix?: '&') {
    let params = new URLSearchParams(window.location.search);
    let nextParams = new URLSearchParams();

    for (let key of keys) {
        let value = params.get(key);

        if (value) nextParams.set(key, value);
    }

    let query = nextParams.toString();

    return query ? query + (postfix ?? '') : '';
}
