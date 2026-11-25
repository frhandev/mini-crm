import type { Item } from '@/types/quotation';

export const total = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
