
import React from 'react';
import { CategoryType, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'آيفون 15 برو ماكس',
    description: 'أحدث هاتف من شركة آبل مع معالج A17 Pro وكاميرا احترافية.',
    price: 14500,
    category: CategoryType.ELECTRONICS,
    image: 'https://picsum.photos/seed/iphone/600/400',
    stock: 10
  },
  {
    id: '2',
    name: 'صانعة قهوة إسبريسو',
    description: 'ماكينة احترافية لتحضير القهوة في المنزل بجودة المقاهي.',
    price: 2200,
    category: CategoryType.HOME,
    image: 'https://picsum.photos/seed/coffee/600/400',
    stock: 25
  },
  {
    id: '3',
    name: 'مرسيدس بنز G-Class 2024',
    description: 'سيارة الدفع الرباعي الفاخرة، قوة وأناقة على جميع الطرقات.',
    price: 2500000,
    category: CategoryType.CARS,
    image: 'https://picsum.photos/seed/gclass/600/400',
    stock: 2
  },
  {
    id: '4',
    name: 'تلفزيون سامسونج QLED 65"',
    description: 'تجربة مشاهدة سينمائية مع دقة 4K وألوان واقعية.',
    price: 8500,
    category: CategoryType.ELECTRONICS,
    image: 'https://picsum.photos/seed/tv/600/400',
    stock: 15
  }
];

export const INITIAL_SETTINGS = {
  fbPixel: '',
  googleAnalytics: '',
  tiktokPixel: '',
  googleSheetsUrl: '',
  domain: 'myshop.com',
  nameServer: 'ns1.hosting.com'
};
