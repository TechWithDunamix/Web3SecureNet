export function numberOrNull(value: unknown): number | null {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatNumber(value: unknown, options?: Intl.NumberFormatOptions): string {
  const parsed = numberOrNull(value);
  return parsed === null ? '—' : parsed.toLocaleString(undefined, options);
}
