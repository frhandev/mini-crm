export const statusLabels = {
  Draft: 'Taslak',
  Sent: 'Gönderildi',
  Accepted: 'Kabul Edildi',
  Rejected: 'Reddedildi',
} as const;
export type Status = keyof typeof statusLabels;

export type Item = { description: string; quantity: number; unitPrice: number };
export type Quote = {
  id: string;
  reference: string;
  customerId: string;
  createdAt: string;
  status: Status;
  items: Item[];
};