/** Digits-only; formats with Indian-style grouping as user types. */
export function parseCurrencyDigits(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return Number.parseInt(digits, 10);
}

export function formatInrInput(value: number): string {
  if (value <= 0) return "";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}
