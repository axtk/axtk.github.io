import {stripQuotes} from './stripQuotes';

export function split(s: string, splitChar = ',') {
    let items: string[] = [];
    let item = '';
    let open = false;

    for (let c of s) {
        if (c === splitChar && !open) {
            items.push(stripQuotes(item));
            item = '';
            continue;
        }
        if (c === '"') open = !open;
        item += c;
    }

    if (item) items.push(stripQuotes(item));

    return items;
}
