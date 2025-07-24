import {stripQuotes} from './stripQuotes';

export function transformMap(data: string) {
    return data.trim().split(/\r?\n/).slice(1).reduce<Record<string, string>>((map, line) => {
        let [key, value] = line.split(',').map(stripQuotes);

        if (key && value)
            map[key] = value;

        return map;
    }, {});
}
