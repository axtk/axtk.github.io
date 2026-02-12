export function stripQuotes(s: string | undefined) {
  if (!s || !s.startsWith('"') || !s.endsWith('"')) return s;

  return s.slice(1, -1);
}
