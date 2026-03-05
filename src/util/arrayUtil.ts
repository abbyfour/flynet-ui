export function uniquify<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function injectMap<T, U>(
  array: T[],
  mapFunc: (item: T) => U,
  injectIf: (cur: T, prev: T | undefined) => U,
): U[] {
  const result: U[] = [];

  array.forEach((cur, i) => {
    const prev = i > 0 ? array[i - 1] : undefined;
    const injected = injectIf(cur, prev);
    if (injected) {
      result.push(injected);
    }
    result.push(mapFunc(cur));
  });

  return result;
}
