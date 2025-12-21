
export enum CategoryType {
  ELECTRONICS = 'إلكترونيات',
  HOME = 'منزل',
  CARS = 'سيارات'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  image: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  fullName: string;
  city: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SiteSettings {
  fbPixel: string;
  googleAnalytics: string;
  tiktokPixel: string;
  googleSheetsUrl: string;
  domain: string;
  nameServer: string;
}
