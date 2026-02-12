export function pickRandom<T>(items: T[], limit: number | undefined) {
  if (limit === undefined || limit >= items.length) return items;

  let hashes = new Set<string>();
  let pickedItems: T[] = [];

  while (pickedItems.length < limit) {
    let item = items[Math.floor(items.length * Math.random())];
    let hash = JSON.stringify(item);

    if (!hashes.has(hash)) {
      pickedItems.push(item);
      hashes.add(hash);
    }
  }

  return pickedItems;
}
