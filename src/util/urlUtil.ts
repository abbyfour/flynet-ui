export function parseURLIntParam(
  value: string | undefined,
): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

export function decodeURLParam(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function encodeURLParam(value: string | number): string {
  return encodeURIComponent(value);
}

export function joinPathSegments(...segments: Array<string | number>): string {
  return `/${segments.join("/")}`;
}
