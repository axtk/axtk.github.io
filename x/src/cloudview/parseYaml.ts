// @ts-ignore
import {parse} from 'yeahml';

export function parseYaml<T>(s: string | undefined) {
    if (!s)
        return;

    return parse(s) as T;
}
