import {split} from './split';
import {stripQuotes} from './stripQuotes';

function toCamelCase(s: string) {
    return s.replace(/(\w)_(\w)/g, (_s, a, b) => `${a}${b.toUpperCase()}`);
}

const transform = {
    cropPreview: JSON.parse,
    hideDate: JSON.parse,
    aspectRatio: Number,
};

export type Config = {
    title?: string;
    index?: string | string[];
    cropPreview?: boolean;
    hideDate?: boolean;
    aspectRatio?: number;
    sort?: string;
};

export function parseConfig(s: string | undefined): Config | undefined {
    if (!s)
        return;

    let lines = s.split(/\r?\n/).filter(x => x.trim() !== '');

    let data: Record<string, string | string[] | Record<string, string>> = {};
    let parentKey = '';
    let parentItem: string[] | Record<string, string> | null = null;

    for (let line of lines) {
        let [k, v] = split(line, ':');

        if (parentKey) {
            if (k.startsWith('  ')) {
                k = k.trim();

                if (k.startsWith('-')) {
                    k = k.replace(/^\-\s*/, '');

                    if (!parentItem)
                        parentItem = [];

                    (parentItem as string[]).push(k);
                }
                else {
                    if (!parentItem)
                        parentItem = {};

                    k = toCamelCase(k);
                    v = stripQuotes(v?.trim() ?? '');

                    (parentItem as Record<string, string>)[k] = v;
                }
            }
            else if (parentItem) {
                data[parentKey] = parentItem;
                parentItem = null;
            }
            else data[parentKey] = '';
        }
        else {
            k = toCamelCase(k.replace(/^-\s*/, ''));
            v = v?.trim();

            if (v) {
                v = stripQuotes(v);

                if (k in transform)
                    v = transform[k as keyof typeof transform](v);

                data[k] = v;
            }
            else parentKey = k;
        }
    }

    if (parentKey)
        data[parentKey] = parentItem ?? '';

    return data as Config;
}
