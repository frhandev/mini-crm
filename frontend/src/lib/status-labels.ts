import type { Status } from '@/types/quotation';

export const statusLabels = {
  Draft: 'Taslak',
  Sent: 'Gönderildi',
  Accepted: 'Kabul Edildi',
  Rejected: 'Reddedildi',
} as const satisfies Record<Status, string>;
