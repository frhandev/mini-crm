export const money = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(value);
export const date = (value: string) =>
  new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(new Date(value));
export const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
