export type Status = 'Draft' | 'Sent' | 'Accepted' | 'Rejected';

export type Item = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Quote = {
  id: string;
  reference: string;
  customerId: string;
  createdAt: string;
  status: Status;
  items: Item[];
};
