export interface Subscription {
  id: string;
  userId: string;
  schoolId: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate: Date;
  reportCardsLimit: number;
  reportCardsUsed: number;
  features: Feature[];
  paymentMethod?: PaymentMethod;
  price: {
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface PaymentMethod {
  type: 'card' | 'mobile_money' | 'bank_transfer';
  provider: string;
  lastFour?: string;
  expiryDate?: string;
}