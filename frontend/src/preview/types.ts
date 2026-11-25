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
