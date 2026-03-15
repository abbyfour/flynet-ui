export function uniquify<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function uniquifyBy<T, K>(array: T[], keyFunc: (item: T) => K): T[] {
  const seenKeys = new Set<K>();
  const result: T[] = [];

  array.forEach((item) => {
    const key = keyFunc(item);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(item);
    }
  });

  return result;
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

export function compareObjects(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): boolean {
  if (!obj1 || !obj2) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (val1 instanceof Date && val2 instanceof Date) {
      if (val1.getTime() !== val2.getTime()) {
        return false;
      }
    } else if (typeof val1 === "object" && typeof val2 === "object") {
      if (
        !compareObjects(
          val1 as Record<string, unknown>,
          val2 as Record<string, unknown>,
        )
      ) {
        return false;
      }
    } else if (
      (val1 === undefined || val1 === null || val1 === "") &&
      (val2 === undefined || val2 === null || val2 === "")
    ) {
      continue;
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
