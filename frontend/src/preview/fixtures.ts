import type { Activity } from '@/types/activity';
import type { Customer } from '@/types/customer';
import type { Quote, Status } from '@/types/quotation';
import type { Member } from '@/types/user';
const uuid = (group: number, n: number) =>
  `00000000-0000-4000-8000-${String(group * 1000 + n).padStart(12, '0')}`;
const firms = [
  'Atlas Teknoloji',
  'Meridyen Bilişim',
  'Anadolu Yazılım',
  'Nova Danışmanlık',
  'Pusula Tasarım',
  'Eksen Mimarlık',
  'Kuzey Lojistik',
  'Mavi Endüstri',
  'Çınar Yapı',
  'Duru İletişim',
  'Ada Otomasyon',
  'Ufuk Enerji',
];
const names = [
  'Deniz Aydın',
  'Ece Arslan',
  'Can Demir',
  'Elif Kaya',
  'Bora Güneş',
  'İpek Akın',
  'Ege Yıldız',
  'Seda Işık',
  'Ali Ersoy',
  'Ela Koç',
  'Cem Acar',
  'Aslı Şen',
];
export const customers: Customer[] = firms.map((companyName, i) => ({
  id: uuid(1, i),
  companyName,
  name: names[i],
  email: `iletisim${i + 1}@example.com`,
  phone: `+90 (000) 555 00 ${String(i + 10)}`,
  createdAt: new Date(Date.UTC(2026, 3, i + 1, 9)).toISOString(),
  isArchived: i > 9,
}));
const services = [
  'Kurulum ve yapılandırma',
  'Tasarım danışmanlığı',
  'Uygulama geliştirme',
  'Teknik eğitim',
  'Sistem analizi',
  'Bakım hizmeti',
];
const statuses: Status[] = ['Accepted', 'Sent', 'Draft', 'Accepted', 'Rejected', 'Sent', 'Draft'];
export const quotes: Quote[] = Array.from({ length: 36 }, (_, i) => ({
  id: uuid(2, i),
  reference: `QUO-2026-${String(i + 1).padStart(4, '0')}`,
  customerId: customers[i % customers.length].id,
  createdAt: new Date(Date.UTC(2026, 5, 2 + Math.floor(i * 5.03), 10)).toISOString(),
  status: statuses[(35 - i) % 7],
  items: [
    { description: services[i % 6], quantity: 1 + (i % 4), unitPrice: 3500 + i * 125 },
    { description: 'Proje danışmanlığı', quantity: 2, unitPrice: 1200 },
  ],
})).reverse();
// Leave a draft empty so the send restriction can also be reviewed.
quotes.find((q) => q.status === 'Draft')!.items = [];
export const members: Member[] = [
  { id: uuid(3, 1), name: 'Selin Yalçın', email: 'selin@example.com', admin: true, active: true },
  { id: uuid(3, 2), name: 'Mert Öz', email: 'mert@example.com', admin: false, active: true },
  { id: uuid(3, 3), name: 'Ayça Deniz', email: 'ayca@example.com', admin: false, active: false },
];
export const activities: Activity[] = customers
  .map((c, i) => ({
    id: c.id,
    user: members[i % 2].name,
    action: 'Müşteri oluşturuldu',
    entity: 'Müşteri',
    description: c.companyName,
    date: c.createdAt,
  }))
  .reverse();
