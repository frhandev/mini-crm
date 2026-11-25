export const statusLabels = {
  Draft: 'Taslak',
  Sent: 'Gönderildi',
  Accepted: 'Kabul Edildi',
  Rejected: 'Reddedildi',
} as const;
export type Status = keyof typeof statusLabels;
export type Customer = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  isArchived: boolean;
};
export type Item = { description: string; quantity: number; unitPrice: number };
export type Quote = {
  id: string;
  reference: string;
  customerId: string;
  createdAt: string;
  status: Status;
  items: Item[];
};
export type Member = { id: string; name: string; email: string; admin: boolean; active: boolean };
export type Activity = {
  id: string;
  user: string;
  action: string;
  entity: string;
  description: string;
  date: string;
};
export const total = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
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
export const pageNames = {
  dashboard: 'Genel Bakış',
  customers: 'Müşteriler',
  customer: 'Müşteri Detayları',
  newCustomer: 'Yeni Müşteri',
  editCustomer: 'Müşteriyi Düzenle',
  quotes: 'Teklifler',
  quote: 'Teklif Detayları',
  newQuote: 'Yeni Teklif',
  editQuote: 'Taslağı Düzenle',
  users: 'Kullanıcılar',
  settings: 'Şirket Ayarları',
  activity: 'İşlem Geçmişi',
  profile: 'Profilim',
  login: 'Giriş Yap',
  forbidden: 'Erişim Engellendi',
  missing: 'Sayfa Bulunamadı',
  error: 'Bir Sorun Oluştu',
} as const;
export type Page = keyof typeof pageNames;
export type Go = (page: Page, id?: string) => void;
export type Scenario = 'normal' | 'loading' | 'empty' | 'error' | 'success' | 'invalid' | 'dirty';
