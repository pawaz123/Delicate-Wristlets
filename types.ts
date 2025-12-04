export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  productName: string;
  price: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export interface StylistResponse {
  recommendation: string;
  suggestedMaterial: string;
  styleAdvice: string;
}

export const DEFAULT_CATEGORIES = ['Gold', 'Silver', 'Rose Gold', 'Diamond'];