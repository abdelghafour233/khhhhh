
import React from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  addToCart: (p: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, addToCart }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 rounded-3xl overflow-hidden bg-blue-600 flex items-center px-12 text-white">
        <div className="z-10 max-w-xl space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">أفضل المنتجات بأفضل الأسعار</h1>
          <p className="text-lg opacity-90">اكتشف تشكيلة واسعة من الإلكترونيات، الأثاث المنزلي والسيارات الفاخرة.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
            تسوق الآن
          </button>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <img src="https://picsum.photos/seed/shopping/800/600" alt="Hero" className="object-cover w-full h-full" />
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">المنتجات المميزة</h2>
          <span className="text-blue-600 cursor-pointer">عرض الكل ←</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
