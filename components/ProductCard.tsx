
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group">
      <Link to={`/product/${product.id}`} className="block relative h-48">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
          {product.category}
        </span>
      </Link>
      <div className="p-5 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-800 hover:text-blue-600 truncate">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">{product.price.toLocaleString()} د.م.</span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center"
        >
          <span className="ml-2">🛒</span>
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
