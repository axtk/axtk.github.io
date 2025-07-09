function stripQuotes(s: string) {
    return s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s;
}

function split(s: string) {
    let items: string[] = [];
    let item = '';
    let open = false;

    for (let c of s) {
        if (c === ',' && !open) {
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

type IndexEntry = {
    description?: string;
    location?: string;   
};

let indexMap: Record<string, IndexEntry> | null = null;

export function getIndexMap(s: string) {
    if (indexMap)
        return indexMap;

    let lines = s.split(/\r?\n/)
        .map(s => s.trim())
        .filter(s => s !== '');

    if (lines.length === 0)
        return null;

    let map: Record<string, IndexEntry> = {};

    for (let line of lines) {
        let [key, description, location] = split(line);

        if (!key)
            continue;

        map[key] = {
            description,
            location,
        };
    }

    return map;
}
