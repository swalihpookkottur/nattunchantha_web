export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberIN(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function pluralizeUnit(unit: string, count: number): string {
  if (count === 1) return unit;
  if (unit === 'Box') return 'Boxes';
  return `${unit}s`;
}
