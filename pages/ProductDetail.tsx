
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductDetailProps {
  products: Product[];
  addToCart: (p: Product, q: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="text-center py-20">المنتج غير موجود</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <nav className="text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-blue-600">الرئيسية</Link> / 
              <span className="mr-1">{product.category}</span>
            </nav>
            <h1 className="text-4xl font-extrabold">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600">{product.price.toLocaleString()} د.م.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-6 space-x-reverse">
              <span className="font-bold">الكمية:</span>
              <div className="flex items-center border rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100 text-xl font-bold"
                >-</button>
                <span className="px-6 py-2 font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100 text-xl font-bold"
                >+</button>
              </div>
            </div>

            <button 
              onClick={() => addToCart(product, quantity)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-extrabold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              أضف إلى السلة
            </button>
          </div>
          
          <div className="flex items-center text-sm text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
            <span className="ml-2">✅</span>
            متوفر في المخزون وشحن سريع لجميع المدن
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
