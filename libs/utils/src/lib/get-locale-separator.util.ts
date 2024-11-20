export function getLocaleDecimalSeparator(): string {
  const numberFormat = new Intl.NumberFormat(undefined);
  const parts = numberFormat.formatToParts(1.1);
  const decimalPart = parts.find((part) => part.type === 'decimal');
  return decimalPart?.value || '.';
}
