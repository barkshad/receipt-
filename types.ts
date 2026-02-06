
export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  id: string;
  date: string;
  shopName: string;
  shopAddress: string;
  customerName: string;
  customerPhone: string;
  items: ReceiptItem[];
  taxRate: number;
  currency: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  customer: string;
  total: number;
}
