export function stripQuotes(s: string) {
    return s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s;
}
