export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function random() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function monthRng(seed: number, month: number, salt = ''): () => number {
  return mulberry32((seed ^ Math.imul(month + 1, 2654435761) ^ hashString(salt)) >>> 0);
}

export function weightedPick<T>(items: T[], weight: (item: T) => number, random: () => number): T | undefined {
  const weighted = items.map(item => ({ item, w: Math.max(0, weight(item)) })).filter(x => x.w > 0);
  const total = weighted.reduce((sum, x) => sum + x.w, 0);
  if (total <= 0) return undefined;
  let roll = random() * total;
  for (const entry of weighted) {
    roll -= entry.w;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1]?.item;
}
